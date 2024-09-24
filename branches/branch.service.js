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
    removeUserFromBranch,

    deactivateBranch,
    reactivateBranch
};

async function getAllBranch() {
    return await db.Branch.findAll();
}
async function getBranchById(id) {
    try {
        const branch = await db.Branch.findByPk(id, {
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'role']
            }]
        });
        
        if (!branch) {
            throw new Error('Branch not found');
        }

        return branch;
    } catch (error) {
        // Handle or log the error as necessary
        console.error('Error fetching branch:', error.message);
        throw error; // Rethrow or handle as needed
    }
}
async function createBranch(params) {
    const branch = new db.Branch(params);

    if (await db.Branch.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already registered';
    }

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
async function removeUserFromBranch(branchId, userId) {
    const user = await db.User.findOne({ where: { id: userId, branchId: branchId } });
    if (!user) throw 'User not found or not assigned to this branch';

    user.branchId = null;
    await user.save();

    return { message: 'User removed from branch' };
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