import ProfileModel from '../models/Profile.js';
class ProfileController {
  getProfiles = async (req, res) => {
    const profiles = await ProfileModel.find();
    res.json(profiles);
  };

  getProfile = async (req, res) => {
    const id = req.params?.id;
    const profile = await ProfileModel.findById(id);
    if (!profile) return res.status(500).json({ error: 'not found' });
    res.json(profile);
  };
}
export default new ProfileController();
