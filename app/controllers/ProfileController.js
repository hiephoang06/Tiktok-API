import ProfileModel from '../models/Profile.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
class ProfileController {
  getProfiles = async (req, res) => {
    const profiles = await ProfileModel.find();
    res.json(profiles);
  };

  getProfile = async (req, res) => {
    const id = req.params?.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'profile invalid' });
    const profile = await ProfileModel.findById(id);
    if (!profile) return res.status(400).json({ error: 'not found' });
    res.json(profile);
  };

  getMyProfile = async (req, res) => {
    const profile = await ProfileModel.findById(req.user._id);
    res.json(profile);
  };
}
export default new ProfileController();
