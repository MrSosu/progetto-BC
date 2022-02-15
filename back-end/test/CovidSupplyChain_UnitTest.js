const CovidSupplyChain = artifacts.require("./CovidSupplyChain.sol");

contract("CovidSupplyChain", accounts => {

    // Unit test 1: Add an actor and retrieve an Actor
    it("... should correctly add and retrieve a new actor.", async () => {
        const CSC = await CovidSupplyChain.deployed();
        const actorName = "Pzifer";
        const actorRole = 0;

        const result = await CSC.addActor(accounts[1], actorName, actorRole, { from: accounts[0] });
        const actor =  await CSC.getActor(accounts[1]);

        //console.log(result.logs[0].args)

        assert.equal(result.logs[0].args.name, actorName, "The name of the actor should correspond respect the emitted event.")
        assert.equal(result.logs[0].args.role, actorRole, "The role of the actor should correspond respect the emitted event.")

        assert.equal(actor['1'], actorName, "The name of the actor should correspond respect data stored on chain.")
        assert.equal(actor['2'], actorRole, "The role of the actor should correspond respect data stored on chain.")
    });

    // Unit test 2: Add a new vaccine batch
    it("... should correctly add a new batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();
        //const res_actor = await CSC.addActor("Pzifer", 0, { from: accounts[1] });
        const res_batch = await CSC.addBatch(-4,256,{ from: accounts[1] });
        //const memo = await CSC.batches(0);

        //console.log(res_batch.logs[0].args);
        //console.log(memo)
        
    });

    // Unit test 3: Update a vaccine status
    it("... should correctly update status batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        const res_actor = await CSC.addActor("UPS Logistics", 1, { from: accounts[2] });

        const res_batch = await CSC.addBatch(-4,256,{ from: accounts[1] });

        const id_inserted = 0; //ripescare da sopra

        const res_batch2 = await CSC.updateStatus( id_inserted, { from: accounts[2] });

        //console.log( id_inserted, id_updated );
    });

    // Unit test 4: Retrieve batch timeline
    it("... should correctly update status batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        //console.log(memo)

        const time = await CSC.getTimeline(0);
        //console.log(time);

        var newDate = new Date(time['3'][0].toNumber()*1000);
        dateString = newDate.toUTCString();
        //console.log(dateString);
        //console.log(time['1'][0].toNumber())

    });

    // Unit test 5: Retrieve my last n batch
    it("... should correctly retrieve my batch.", async () => {
        const CSC = await CovidSupplyChain.deployed();

        const memo = await CSC.getMyLastNBatch(3, accounts[1], { from: accounts[1] });
        console.log(memo);
        console.log(memo['1'][0].toNumber());

    });


});
