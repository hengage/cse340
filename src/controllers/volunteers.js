import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

export async function processVolunteer(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    const userId = req.session.user.user_id;
    await addVolunteer(userId, projectId);
    req.flash('message', 'You have volunteered for this project!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}

export async function processRemoveVolunteer(req, res, next) {
  try {
    const projectId = Number(req.params.id);
    const userId = req.session.user.user_id;
    await removeVolunteer(userId, projectId);
    req.flash('message', 'You have removed your volunteer status.');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}
