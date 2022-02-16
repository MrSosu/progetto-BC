// SPDX-License-Identifier: CC-BY-SA-4.0
pragma solidity >=0.7.0 <0.9.0;


/// @title Supply Chain contract for Covid-19 Vaccine Batch
/// @notice It provides data-field to store logs, function to insert and correctly manipulate data, and it allow safe interaction within actors.
contract CovidSupplyChain {

    // Enums for  Batch Status  the Actor Roles
    // 1. Batch Status follows a subsequent order, the batch status can't go back back, but only forward. (from MANUFACTURED to USED)
    // 2. Each actor has to have a 1 Role on chain, otherwise it cannot send write transaction. 
    enum BatchStatus { MANUFACTURED, DELIVER_NATIONAL, STORED_NATIONAL, DELIVER_REGIONAL, STORED_REGIONAL, DELIVER_HUB, STORED_HUB, USED}
    enum ActorRoles  { MANUFACTURER, COURIER, NATIONAL_FACILITIES, REGIONAL_FACILITIES, VAX_HUB, ADMIN}

    // Actor definition (e.g. [0x08.., 'Pzifer', MANUFACTURER])
    struct Actor
    {
        address id;          // address of the actor   
        string name;         // string name of the actor
        ActorRoles role;     // role of the actor on chain
    }

    // Vaccine Batch definition (e.g. [1028, -20°, [0x04.., ..], [11/08/2021, ..]])
    struct VaccineBatch 
    {
        uint32 size;                // size of the batch
        int32 temp;                 // temperature to stock the batch
        address[] chain_actors;     // list of actors addresses who change the status (no need to store directly the status, since it can be easily retrieved)
        uint256[] chain_dates;      // timestamp of status changes
    }


    // Private representation of current batches and actors.
    VaccineBatch[] batches;
    mapping (address => Actor) actors;


    // Event of the contract
    event AddActor (address id, string name, ActorRoles role);
    event AddBatch (uint id, address manufacturer, uint date);
    event UpdateStatus (uint id, BatchStatus status, address actor, uint date);


    // Constructor is called on deployment
    constructor() {
        // Owner is the 'Main' Administrator.
        actors[msg.sender] = Actor(msg.sender, "Owner Admin", ActorRoles(5));
        emit AddActor(actors[msg.sender].id, actors[msg.sender].name, actors[msg.sender].role);
    }


    // Some function can be executed only by admin
    modifier onlyAdmin() {
        require(actors[msg.sender].role == ActorRoles.ADMIN, "You are not allowed");
        _;
    }

    // Some function can be executed only by the manufacturer
    modifier onlyManufacturer() {
        require(actors[msg.sender].role == ActorRoles.MANUFACTURER, "You are not allowed");
        _;
    }


    /// @notice Add an actor on chain
    /// @dev Emit an event and can be exectued only by admin
    /// @param _add Address of the new actor
    /// @param _name Name of the new actor
    /// @param _role Role of the new actor
    function addActor (address _add, string memory _name, uint _role) public onlyAdmin
    {
        ActorRoles role =  ActorRoles(_role);
        Actor memory member = Actor(_add, _name, role);
        actors[_add] = member;
        emit AddActor(member.id, member.name, member.role);
    }


    /// @notice Retrieve an actor on chain
    /// @dev The actor can not exist
    /// @param _actor Address of the actor
    /// @return Actor address, Actor Name, Actor Role
    function getActor (address _actor) public view returns ( address, string memory,  uint)
    {
        return (actors[_actor].id, actors[_actor].name, uint(actors[_actor].role)) ;
    }


    /// @notice Add a new Vaccine batch on chain
    /// @dev The first batch state is MANUFACTURED, only MANUFATURER can call this function. Emit an event.
    /// @param temp The temperature to correctly stock the batch
    /// @param size The size of the batch
    function addBatch (int32 temp, uint32 size) public onlyManufacturer
    {
        uint256 date = block.timestamp;

        VaccineBatch memory lastBatch;
        lastBatch.temp = temp;
        lastBatch.size = size;
        lastBatch.chain_actors = new address[](1);
        lastBatch.chain_dates = new uint[](1);
        batches.push(lastBatch);

        batches[batches.length-1].chain_actors[0] = msg.sender;
        batches[batches.length-1].chain_dates[0] = date;

        emit AddBatch(batches.length-1, batches[batches.length-1].chain_actors[0], batches[batches.length-1].chain_dates[0]);
    }


    /// @notice Update the status of a batch on the supply chain
    /// @dev New status is automatically recognized, only allowed actor can update from a certain status.
    /// @param _batch the batch id.
    function updateStatus (uint _batch) public
    {
        VaccineBatch storage batch = batches[_batch];
        Actor memory actor = actors[msg.sender];
        BatchStatus status = BatchStatus(batch.chain_actors.length-1);

        if (status == BatchStatus.MANUFACTURED) {
            require(actor.role == ActorRoles.COURIER, "you are not a courier!");
        }
        else if (status == BatchStatus.DELIVER_NATIONAL) {
            require(actor.role == ActorRoles.NATIONAL_FACILITIES, "you are not a national facilities worker!");
        }
        else if (status == BatchStatus.STORED_NATIONAL) {
            require(actor.role == ActorRoles.COURIER, "you are not a courier!");
        }
        else if (status == BatchStatus.DELIVER_REGIONAL) {
            require(actor.role == ActorRoles.REGIONAL_FACILITIES, "you are not a regional facilities worker!");
        }
        else if (status == BatchStatus.STORED_REGIONAL) {
            require(actor.role == ActorRoles.COURIER, "you are not a courier!");
        }
        else if (status == BatchStatus.DELIVER_HUB) {
            require(actor.role == ActorRoles.VAX_HUB, "you are not an hub worker!");
        }
        else if (status == BatchStatus.STORED_HUB) {
            require(actor.role == ActorRoles.VAX_HUB, "you are not an hub worker!");
            require(msg.sender == batch.chain_actors[batch.chain_actors.length-1], "This batch is stored in another Hub.");
        }

        batch.chain_dates.push(block.timestamp);
        batch.chain_actors.push(msg.sender);

        emit UpdateStatus (_batch, BatchStatus(uint(status)+1), actor.id, block.timestamp);
    } 


    /// @notice Retrieve the history of a batch on the supply chain.
    /// @param id The identifier of the batch
    /// @return Size, Temperature, Array of: actor addresses, timestamp of updates, actor names, actor roles.
    function getTimeline (uint id) public view returns ( uint32, int32, address[] memory, uint256[] memory, string[] memory, uint[] memory)
    {
        VaccineBatch memory batch = batches[id];

        string[] memory chain_names = new string[](batch.chain_actors.length);
        uint[] memory chain_roles = new uint[](batch.chain_actors.length);

        for (uint i = 0; i < batch.chain_actors.length; i++) { 
            chain_names[i] = actors[batch.chain_actors[i]].name;
            chain_roles[i] = uint(actors[batch.chain_actors[i]].role);
        }

        return (batch.size, batch.temp, batch.chain_actors, batch.chain_dates, chain_names, chain_roles) ;
    }


    /// @notice Retrieve the last n batch recently updated by a given actor.
    /// @param n the max number of batches to return 
    /// @param actor Address of the actor
    /// @return arrays with summary info about that batches.
    function getMyLastNBatch (uint n, address actor) public view returns ( uint256[] memory, uint256[] memory, uint32[] memory, int32[] memory)
    {
        require( n>0 && n<5, "Parameter n not valid!" );

        uint[] memory ids = new uint[](n);
        uint[] memory status = new uint[](n);
        int32[] memory temps = new int32[](n);
        uint32[] memory sizes = new uint32[](n);

        uint k = 0;

        for (uint i = batches.length; i > 0; i--) {
            uint j = batches[i-1].chain_actors.length-1;
            if(batches[i-1].chain_actors[j] == actor)
            {
                ids[k] = i-1;
                status[k] = j;
                temps[k] = batches[i-1].temp;
                sizes[k] = batches[i-1].size;
                k++;
                if (k >= n){break;}
            }
        }
        return (ids,status,sizes,temps) ;
    }

}