import Optionable from "Optionable"
import assert from "assert";

function Customer (userOptions) {

  Optionable.call(this);

  let emailHandler = new EmailHandler();

  this.lastTitle = "Untitled";

  this.handleOption("name");
  this.handleOption("title", (value)=>this.lastTitle=value);

  /* Test adding a property that has its own handler */
  this.handleOption("email", emailHandler);

};
Customer.prototype = Object.assign(Object.create(Optionable.prototype), {});

function EmailHandler (userOptions) {

  Optionable.call(this);

  this.handleOption("email", function(value){
    if (value.indexOf("@") == -1) {
      throw Error("Invalid Email Address");
    }
  });

};
EmailHandler.prototype = Object.assign(Object.create(Optionable.prototype), {});

describe("Optionable", function() {

  it("can set values from an instance", function() {
    let pg = new Customer();
    let pg2 = new Customer();

    pg.name = "dejapong";
    pg.email = "dejapong@dejapong.com";
    pg.title = "Mr.";
    pg2.name = "jessada"
    pg2.email = "jessada@jessada.com"

    assert.equal(pg.name, "dejapong");
    assert.equal(pg.email, "dejapong@dejapong.com");
    assert.equal(pg.title, "Mr.");
    assert.equal(pg.lastTitle, pg.title);

  });

  it("can deserialize", function() {
    let pg = new Customer();

    pg.deserialize({
      name : "dejapong",
      email : "dejapong@dejapong.com",
      title : "Mr."
    });

    assert.equal(pg.name, "dejapong");
    assert.equal(pg.email, "dejapong@dejapong.com");
    assert.equal(pg.title, "Mr.");
    assert.equal(pg.lastTitle, pg.title);
  });

  it("can partially deserialize", function() {
    let pg = new Customer();
    pg.deserialize({
      name : "dejapong",
    });
    assert.equal(pg.name, "dejapong");
  });

  it("can serialize", function() {

    let pg = new Customer();

    pg.deserialize({
      name : "dejapong",
      email : "dejapong@dejapong.com",
      title : "Mr."
    });

    let serialization = {};

    let returnVal = pg.serialize(serialization);
    assert.equal(returnVal, serialization);
    assert.equal(serialization.name, "dejapong");
    assert.equal(serialization.email, "dejapong@dejapong.com");
    assert.equal(serialization.title, "Mr.");

    // Make sure we didn't return an object that can modify options
    serialization.name = undefined;
    assert.equal(pg.name, "dejapong");
  });

  it("supports subHandlers", function() {
    let pg = new Customer();
    assert.throws(function(){
      pg.deserialize({
        email : "missingatsymbol",
      });
    });
  });

});