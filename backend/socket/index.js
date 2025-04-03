const { Server } = require("socket.io");
const Message = require("../models/Message");
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary"); 
const { Readable } = require("stream");

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_BASE_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      maxHttpBufferSize: 15 * 1024 * 1024,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinEventRoom", async ({ eventId, userId }, callback) => {
      try {
        const event = await Event.findById(eventId);
        if (!event.participants.includes(userId)) {
          return callback("Unauthorized access to event chat");
        }
        
        socket.join(eventId);
        console.log(`User ${userId} joined event room ${eventId}`);
        
        Message.find({ event: eventId })
          .populate("user", "name _id image")
          .sort({ timestamp: -1 })
          .limit(50)
          .then(messages => socket.emit("previousMessages", messages.reverse()));
        
        callback(null);
      } catch (err) {
        callback(err.message);
      }
    });

    socket.on("sendMessage", async (data, callback) => {
      try {
        const newMessage = new Message({
          text: data.text || "",
          user: data.userId,
          event: data.eventId,
          attachments: [] 
        });

        
        if (data.files && data.files.length > 0) {
          for (const file of data.files) {
            try {
              
              const buffer = Buffer.from(file.data, 'base64');
              
              
              const stream = Readable.from(buffer);
              
              // Upload to Cloudinary
              const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                  {
                    folder: "event_chat_attachments",
                    resource_type: "auto" 
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                );
                
                stream.pipe(uploadStream);
              });
                            
              newMessage.attachments.push({
                url: result.secure_url,
                filename: file.name,
                contentType: file.type,
                filesize: file.size,
                public_id: result.public_id 
              });
            } catch (err) {
              console.error("Error uploading file:", err);
            }
          }
        }

        await newMessage.save();
        const populatedMessage = await Message.populate(newMessage, {
          path: "user",
          select: "name image",
        });
        
        io.to(data.eventId).emit("receiveMessage", populatedMessage);
        callback(null);
      } catch (err) {
        console.error("Error saving message:", err);
        callback(err);
      }
    });
    
    socket.on("deleteAttachment", async (data, callback) => {
      try {
        const { messageId, attachmentId, userId, eventId } = data;
      
        const message = await Message.findById(messageId);
        
        if (!message) {
          return callback("Message not found");
        }
        
        if (message.user.toString() !== userId) {
          return callback("Unauthorized to delete this attachment");
        }
        
        const attachment = message.attachments.id(attachmentId);
        
        if (!attachment) {
          return callback("Attachment not found");
        }
        
        if (attachment.public_id) {
          try {
            await cloudinary.uploader.destroy(attachment.public_id);
          } catch (cloudinaryErr) {
            console.error("Error deleting from Cloudinary:", cloudinaryErr);
          }
        }
        
        message.attachments.pull(attachmentId);
        
        if (!message.text && message.attachments.length === 0) {
          await message.deleteOne();
          io.to(eventId).emit("messageDeleted", { messageId });
        } else {
          await message.save();
          io.to(eventId).emit("attachmentDeleted", { messageId, attachmentId });
        }
        
        callback(null);
      } catch (err) {
        console.error("Error deleting attachment:", err);
        callback(err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};