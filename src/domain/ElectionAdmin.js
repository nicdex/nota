import CreateElectionAdmin from '../commands/CreateElectionAdmin';
import ElectionAdminCreated from '../events/ElectionAdminCreated';
import errors from '../domain/Errors';

export default class ElectionAdmin {
  constructor() {
    this._id = null;
  }

  hydrate(evt) {
      if (evt instanceof ElectionAdminCreated) {
        this._onElectionAdminCreated(evt);
      } 
  }

  _onElectionAdminCreated(evt) {
    this._id = evt.electionAdminId;
  }

  execute(command) {
    if (command instanceof CreateElectionAdmin) {
      return this._CreateElectionAdmin(command);
    }
    throw new Error('Unknown command.');
  }

  _CreateElectionAdmin(command) {
    var validationErrors = [];
    if(this._id) {
      validationErrors.push({"field": "", "msg": "ElectionAdmin already exists."})
    }
    if(!command.electionAdminId) {
      validationErrors.push({"field": "electionAdminId", "msg": "ElectionAdmin id is a required field."});
    }
    if(!command.name) {
      validationErrors.push({"field": "name", "msg": "ElectionAdmin name is a required field."});
    }   
    if(command.address && !command.address.postalCode) {
      validationErrors.push({"field": "postalCode", "msg": "Zip / Postal Code is a required field."});
    }
    if(command.address && !command.address.addressRegion) {
      validationErrors.push({"field": "state", "msg": "State is a required field."});
    }    
    if(validationErrors.length > 0) {
      throw new errors.ValidationFailed(validationErrors);
    }  
    var result = [];
    result.push(new ElectionAdminCreated(command.electionAdminId, command.name, command.address));
    return result;
  }
}
