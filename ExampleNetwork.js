var fabricClient = require('./Config/FabricClient');

class ExampleNetwork {

  constructor(userName) {
    this.currentUser;
    this.issuer;
    this.userName = userName;
    this.connection = fabricClient;
  }

  init() {
    var isAdmin = false;
    if (this.userName == "admin") {
      isAdmin = true;
    }
    return this.connection.initCredentialStores().then(() => {
      return this.connection.getUserContext(this.userName, true)
    }).then((user) => {
      this.issuer = user;
      if (isAdmin) {
        return user;
      }
      return this.ping();
    }).then((user) => {
      this.currentUser = user;
      return user;
    })
  }

  beginVoting() {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'beginVoting',
      args: [],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }

  vote(idKandydata, idTokenGlosu) {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'vote',
      args: [idKandydata, idTokenGlosu],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }

  getVote(idTokenGlosu) {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'getVote',
      args: [idTokenGlosu],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }

  getCandidates(idTokenGlosu) {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'getVote',
      args: [idTokenGlosu],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }

  getResultsByCandidates() {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'getResultByCandidates',
      args: [],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }

  getResultsByParties() {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'getResultByParties',
      args: [],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }

  endVoting() {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'endVoting',
      args: [],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }

  beginVoting() {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'beginVoting',
      args: [],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }
}