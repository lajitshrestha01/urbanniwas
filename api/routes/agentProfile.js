import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient(); 

router.post("/update-profile", async (req, res) => {
  try {
    const { id, name, phoneNumber, agencyName, bio, email, avatar } = req.body;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
        agencyName,
        bio,
        avatar,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser }); 
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

export default router;
