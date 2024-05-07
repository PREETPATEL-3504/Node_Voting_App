const express = require('express')
const router = express.Router();
const User = require('../Models/User')
const Candidate = require('../Models/Candidate');
const { jwtAuthmiddelware, generateToken } = require('../jwt');
const { json } = require('body-parser');

const checkadmin = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (user.role === 'admin') {
            return true;
        }
    } catch (error) {
        return false;
    }
}

router.post('/', jwtAuthmiddelware, async (req, res) => {
    try {
        if (!(await checkadmin(req.user.id)))
            return res.status(404).json({ message: 'User does not admin role' })
        const data = req.body
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log("data saved");
        res.status(200).json({ response: response });
    } catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
})

router.put('/:candidateID', jwtAuthmiddelware, async (req, res) => {
    try {

        if (!(await checkadmin(req.user.id)))
            return res.status(404).json({ message: 'User has not admin role' })

        const candidateId = req.params.candidateID;
        const updatecandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatecandidateData, {
            new: true,
            runValidators: true
        })

        if (!response) {
            res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('data updated')
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
})

router.delete('/:candidateID', jwtAuthmiddelware, async (req, res) => {
    try {
        if (!(await checkadmin(req.user.id)))
            return res.status(404).json({ message: 'User has not admin role' })
        const candidateId = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateId)
        if (!response) {
            res.status(404).json({ error: 'Candidate not found' });
        }
        console.log('data deleted')
        res.status(200).json("data deleted successfully");
    } catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
})

router.get('/vote/:candidateID', jwtAuthmiddelware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;
    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        if (user.role == 'admin') {
            return res.status(403).json({ message: 'admin is not allowed' });
        }
        if (user.isVoted) {
            return res.status(400).json({ message: 'You have already voted' });
        }
        //Update candidate data wheb user give a vote
        candidate.votes.push({ user: userId })
        candidate.VoteCount++
        await candidate.save()

        user.isVoted = true;
        await user.save();
        res.status(200).json({ message: "Vote Completed" });

    } catch (err) {
        res.status(500).json({ error: "Internal Server error" });
    }
})

// vote count 
router.get('/votes/count', async (req, res) => {
    try {
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });
        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.VoteCount
            }
        });
        return res.status(200).json(voteRecord);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;