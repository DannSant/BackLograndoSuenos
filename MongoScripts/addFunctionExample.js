db.system.js.save(
   {
     _id: "last",
     value : function last(x) { return db.test.find().skip(db.test.count() - x); }
   }
)