const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = {
    getAllBranch,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch: _deleteBranch,
    getBranch,
    assignUser,

    deactivateBranch,
    reactivateBranch
};

async function getAllBranch() {
    return await db.Branch.findAll();
}
async function getBranchById(id) {
    const branch = await db.Branch.findByPk(id);
    if (!branch) throw 'Branch not found';
    return branch;
}
async function createBranch(params) {
    const branch = new db.Branch(params);
    await branch.save();
}
async function updateBranch(id, params) {
    const branch = await getBranchById(id);
    Object.assign(branch, params);
    await branch.save();
}
async function _deleteBranch(id) {
    const branch = await getBranchById(id);
    branch.status = 'deleted';
    await branch.save();
}
async function getBranch(id) {
    const branch = await db.Branch.findByPk(id);
    if (!branch) throw 'Branch ad found';
    return branch;
}
async function assignUser(branchId, userId) {
    const branch = await getBranchById(branchId);
    const user = await db.User.findByPk(userId);
    if (!branch) throw 'Branch not found';
    if (!user) throw 'User not found';
    
    await user.setBranch(branch);

    await user.save(); 
}
//========================================================================================================
async function deactivateBranch(id) {
    const branch = await getBranchById(id);
    if (!branch) throw 'User not found';

    if (branch.status === 'deactivated') throw 'Branch is already deactivated';

    branch.status = 'deactivated';
    await branch.save();
}
async function reactivateBranch(id) {
    const branch = await getBranchById(id);
    if (!branch) throw 'User not found';

    if (branch.status === 'active') throw 'Branch is already active';

    branch.status = 'active';
    await branch.save();
}