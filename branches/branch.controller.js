const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const branchService = require('./branch.service');
const authenticate = require('_middleware/authenticate');
const authorize = require('_middleware/authorize');
const Role = require('_helpers/role');


router.get('/',authenticate,authorize([Role.Admin]), getAllBranch);
router.get('/:id',authenticate,authorize([Role.Admin, Role.User]), getBranchById);
router.post('/', authenticate,authorize([Role.Admin]),createBranch);
router.put('/:id', authenticate,authorize([Role.Admin]),updateBranch);
router.post('/:id/assign/:userId',authenticate,authorize([Role.Admin]), assignUser);
router.post('/:id/remove/:userId',authenticate,authorize([Role.Admin]), removeUserFromBranch);

module.exports = router;

function getAllBranch(req, res, next) {
    branchService.getAllBranch()
        .then(branches => res.json(branches))
        .catch(next);
}
function getBranchById(req, res, next) {
    const loggedInUserId = req.user.id; // Get logged-in user's ID
    const requestedUserId = parseInt(req.params.id, 10); // Get requested user ID from params

    // Allow user to access their own branch data
    if (req.user.role === Role.User && loggedInUserId !== requestedUserId) {
        return res.status(403).json({ message: 'Unauthorized to access this data' });
    }

    branchService.getBranchById(req.params.id)
        .then(branch => res.json(branch))
        .catch(next);
}
function createBranch(req, res, next) {
    branchService.createBranch(req.body)
        .then(() => res.json({ message: 'Branch created' }))
        .catch(next);
}
function updateBranch(req, res, next) {
    branchService.updateBranch(req.params.id, req.body)
        .then(() => res.json({ message: 'Branch updated' }))
        .catch(next);
}
function _deleteBranch(req, res, next) {
    branchService.deleteBranch(req.params.id)
        .then(() => res.json({ message: 'Branch deleted' }))
        .catch(next);
}
function assignUser(req, res, next) {
    branchService.assignUser(req.params.id, req.params.userId)
        .then(() => res.json({ message: 'User assigned to branch' }))
        .catch(next);
}
function removeUserFromBranch(req, res, next) {
    branchService.removeUserFromBranch(req.params.id, req.params.userId)
        .then(() => res.json({ message: 'User removed from branch' }))
        .catch(next);
}
//======================================================================================================



function deactivateBranch(req, res, next) {
    branchService.deactivateBranch(req.params.id)
        .then(() => res.json({ message: 'User deactivated successfully' }))
        .catch(next);
}
function reactivateBranch(req, res, next) {
    branchService.reactivateBranch(req.params.id)
        .then(() => res.json({ message: 'User reactivated successfully' }))
        .catch(next);
}
