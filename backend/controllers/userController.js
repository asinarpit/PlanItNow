const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, image: imageUrl } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle image updates
    if (req.files?.image) {
      // File upload
      const file = req.files.image[0];
      
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      user.image = result.secure_url;
    } else if (imageUrl) {
      // URL-based update
      // You might want to validate the URL here
      if (isValidImageUrl(imageUrl)) { // Implement your URL validation
        user.image = imageUrl;
      } else {
        return res.status(400).json({ message: "Invalid image URL" });
      }
    }

    await user.save();

    res.status(200).json({ 
      message: "User updated successfully", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const isValidImageUrl = (url) => {
  try {
    new URL(url); 
    return /\.(jpeg|jpg|png|webp)$/i.test(url);
  } catch {
    return false;
  }
};


const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeDeviceToken = async (req, res) => {
  const { deviceToken } = req.body;
  const userId = req.user.id;

  if (!deviceToken) {
    return res.status(400).json({ message: "Device token is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.deviceTokens = user.deviceTokens.filter(
      (token) => token !== deviceToken
    );
    await user.save();

    return res
      .status(200)
      .json({ message: "Device token removed successfully" });
  } catch (error) {
    console.error("Error removing device token:", error);
    return res.status(500).json({
      message: "Error removing device token",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  changeUserRole,
  deleteUser,
  removeDeviceToken,
  updateUser,
};
