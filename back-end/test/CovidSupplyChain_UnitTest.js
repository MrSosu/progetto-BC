const truffleAssert = require('truffle-assertions');
const CovidSupplyChain = artifacts.require("./CovidSupplyChain.sol");


contract("CovidSupplyChain", accounts => {

    // Unit test 1: an admin has to correctly add a new actor
    it("... an admin should correctly add a new actor.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        const actorName = "Pzifer";
        const actorRole = 0;

        // account[0] is owner and admin
        const result = await CSC.addActor(accounts[1], actorName, actorRole, { from: accounts[0] });
        const actor =  await CSC.getActor(accounts[1]);

        assert.equal(actor['1'], actorName, "The name of the actor should correspond respect data stored on chain.")
        assert.equal(actor['2'], actorRole, "The role of the actor should correspond respect data stored on chain.")
    });


    // Unit test 2: a non admin actor should not add a new actor
    it("... a non admin actor should not add a new actor", async () => {
        const CSC = await CovidSupplyChain.deployed();

        const non_admin = accounts[1];  // Pzifer, created in the first test, above
        const new_actor = accounts[2];  // let's try to create a courier

        await truffleAssert.reverts(
            CSC.addActor(new_actor, "Bartolini", 1, { from: non_admin }), 
            'You are not allowed' );
    });
    
    
    // Unit test 3: a Manufacturer should correctly add a new batch.
    it("... a Manufacturer should correctly add a new batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        //  accounts[1] is pzifer
        const res_batch = await CSC.addBatch(-4, 256, { from: accounts[1] });
        const event = res_batch.logs[0].args;

        assert.equal(event.manufacturer, accounts[1], "Manufacturer has to correspond.");
        assert.isBelow(new Date(event.date.toNumber()), new Date(), "Timestamp has to refer to the past.");
    });


    // Unit test 4: a non Manufacturer should not add a new batch.
    it("... a non-Manufacturer should not correctly add a new batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        const result = await CSC.addActor(accounts[2], 'bartolini', 1, { from: accounts[0] });

        await truffleAssert.reverts(
            CSC.addBatch(-4, 256, { from: accounts[2] }), 
            'You are not allowed' );
    });


    // Unit test 5: an allowed actor should correctly update status batch
    it("... an allowed actor should correctly update status batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        // account[2] is bartolini, see test above
        // 0 is the batch id manufactued in unit test n°3 by pfizer
        // we should correctly update the status from 'manufactured' to 'Deliver_international'
        const res_batch = await CSC.updateStatus( 0 , { from: accounts[2] });
        const event = res_batch.logs[0].args;

        assert.equal(event.status,1, "Batch State is not well updated.");
    });


    // Unit test 6: an non-allowed actor should not correctly update status batch
    it("... an non-allowed actor should correctly update status batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        // account[2] is bartolini, see test above
        // 0 is the batch id delivered by bartolini, see above tests
        // Bartolini should NOT correctly update the status from 'Deliver_international' to 'stored_national'
        // Only a facility actor can perform this step on the chain.
        await truffleAssert.reverts(
            CSC.updateStatus( 0 , { from: accounts[2] }),
            'you are not a national facilities worker!' );
    });


    
    // Unit test 7: Everyone should correctlty retrieve last n batch modified by a given actor
    it("... everyone should correctlty retrieve last n batch modified by a given actor", async () => {
        const CSC = await CovidSupplyChain.deployed();

        const memo = await CSC.getMyLastNBatch(3, accounts[1], { from: accounts[1] });

        assert.equal(memo['0'].length, 3, "Arrays have different legnth than n. ");
    });


    // Unit test 8: should correctly retrieve a timeline
    it("... should correctly retrieve a timeline.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        const memo = await CSC.getTimeline(0, { from: accounts[1] });
        
        // Batch 0 has 2 status change.
        assert.equal(memo['3'].length, 2, "Batch status updates does not numerically correspond. ");
    });


});
