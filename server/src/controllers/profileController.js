const Profile = require('../models/Profile');
const { uploadToS3, deleteFromS3 } = require('../config/aws');

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    profileData.userId = req.user._id;

    let profile = await Profile.findOne({ userId: req.user._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { userId: req.user._id },
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      profile = await Profile.create(profileData);
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { documentType } = req.body; // resume, idCard, tenthMarks, intermediateMarks
    const fileName = `${req.user._id}/${documentType}_${Date.now()}_${req.file.originalname}`;
    const folder = 'documents/resumes';

    const result = await uploadToS3(req.file, folder, fileName);

    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user._id });
    }

    // Update the appropriate document URL
    if (documentType === 'resume') {
      profile.documents.resumeUrl = result.Location;
    } else if (documentType === 'idCard') {
      profile.documents.idCardUrl = result.Location;
    } else if (documentType === 'tenthMarks') {
      profile.documents.tenthMarksUrl = result.Location;
    } else if (documentType === 'intermediateMarks') {
      profile.documents.intermediateMarksUrl = result.Location;
    }

    await profile.save();

    res.json({
      success: true,
      url: result.Location,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('userId', 'name rollNumber email department year cgpa');
    res.json({
      success: true,
      profiles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('userId');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  uploadDocument,
  getAllProfiles,
  getProfileByUserId,
};
