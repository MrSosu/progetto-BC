// SPDX-License-Identifier: CC-BY-SA-4.0
pragma solidity >=0.7.0 <0.9.0;

contract CovidSupplyChain {

    enum BatchStatus { MANUFACTURED, DELIVER_NATIONAL, STORED_NATIONAL, DELIVER_REGIONAL, STORED_REGIONAL, DELIVER_HUB, STORED_HUB, USED}
    enum ActorRoles  { MANUFACTURER, COURIER, NATIONAL_FACILITIES, REGIONAL_FACILITIES, VAX_HUB}

    struct Actor
    {
        address id;
        string name;
        ActorRoles role;
    }

    struct VaccineBatch 
    {
        uint id;
        BatchStatus status;
        address[] chain_actors;
        uint256[] chain_dates;
    }

    uint vaccineId = 0; // contatore globale per l'id dei vaccini

    VaccineBatch[] public batches;
    mapping (address => Actor) actors;

    event AddActor (address id, string name, ActorRoles role);
    event AddBatch (uint id, address manufacturer, uint date);
    event UpdateStatus (uint id, BatchStatus status, address actor, uint date);


    function getTimeline (uint id) public view returns ( address[] memory, uint256[] memory)
    {
        VaccineBatch memory batch = batches[id];
        return (batch.chain_actors, batch.chain_dates) ;
    }



    function addActor (string memory _name, uint _role) public 
    {
        ActorRoles role =  ActorRoles(_role);
        Actor memory member = Actor(msg.sender, _name, role);
        actors[msg.sender] = member;
        emit AddActor(member.id, member.name, member.role);
    }

    function getActor (address _actor) public view returns ( address, string memory,  uint)
    {
        return (actors[_actor].id, actors[_actor].name, uint(actors[_actor].role)) ;
    }


    function addBatch () public {
        require(actors[msg.sender].role == ActorRoles.MANUFACTURER, "you can't add a batch!");

        uint256 date = block.timestamp;

        VaccineBatch memory lastBatch;
        lastBatch.id = vaccineId;
        lastBatch.status = BatchStatus.MANUFACTURED;
        lastBatch.chain_actors = new address[](1);
        lastBatch.chain_dates = new uint[](1);
        batches.push(lastBatch);

        batches[batches.length-1].chain_actors[0] = msg.sender;
        batches[batches.length-1].chain_dates[0] = date;

        emit AddBatch(batches.length-1, batches[batches.length-1].chain_actors[0], batches[batches.length-1].chain_dates[0]);
        
        vaccineId++;
    }



    function updateStatus (uint _batch) public
    {
        VaccineBatch storage batch = batches[_batch];
        Actor memory actor = actors[msg.sender];
        if (batch.status == BatchStatus.MANUFACTURED) {
            require(actor.role == ActorRoles.COURIER, "you are not a courier!");
            batch.status = BatchStatus.DELIVER_NATIONAL;
        }
        else if (batch.status == BatchStatus.DELIVER_NATIONAL) {
            require(actor.role == ActorRoles.NATIONAL_FACILITIES, "you are not a national facilities worker!");
            batch.status = BatchStatus.STORED_NATIONAL;
        }
        else if (batch.status == BatchStatus.STORED_NATIONAL) {
            require(actor.role == ActorRoles.COURIER, "you are not a courier!");
            batch.status = BatchStatus.DELIVER_REGIONAL;
        }
        else if (batch.status == BatchStatus.DELIVER_REGIONAL) {
            require(actor.role == ActorRoles.REGIONAL_FACILITIES, "you are not a regional facilities worker!");
            batch.status = BatchStatus.STORED_REGIONAL;
        }
        else if (batch.status == BatchStatus.STORED_REGIONAL) {
            require(actor.role == ActorRoles.COURIER, "you are not a courier!");
            batch.status = BatchStatus.DELIVER_HUB;
        }
        else if (batch.status == BatchStatus.DELIVER_HUB) {
            require(actor.role == ActorRoles.VAX_HUB, "you are not an hub worker!");
            batch.status = BatchStatus.STORED_HUB;
        }
        else if (batch.status == BatchStatus.STORED_HUB) {
            require(actor.role == ActorRoles.VAX_HUB, "you are not an hub worker!");
            batch.status = BatchStatus.USED;
        }
        batch.chain_dates.push(block.timestamp);
        batch.chain_actors.push(msg.sender);
        emit UpdateStatus (batch.id, batch.status, actor.id, block.timestamp);
    } 

}