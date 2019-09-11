const partialUpdate = require("../../helpers/partialUpdate");

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
    function () {

      // FIXME: write real tests!
      expect(partialUpdate('jobs', { 'name': 'Luke' }, 'id', 1)).toEqual({ query: "UPDATE jobs SET name=$1 WHERE id=$2 RETURNING *", values: ["Luke", 1] });


    });

  it("should update more than one field",
    function () {
      expect(partialUpdate('jobs', { 'name': 'Luke', 'title': 'engineer' }, 'id', 1)).toEqual({ query: "UPDATE jobs SET name=$1, title=$2 WHERE id=$3 RETURNING *", values: ["Luke", "engineer", 1] });
    })

  it("should filter out keys that start with _",
    function () {
      expect(partialUpdate('jobs', { '_token': 'randomToken', 'name': 'Luke', 'title': 'engineer' }, 'id', 1)).toEqual({ query: "UPDATE jobs SET name=$1, title=$2 WHERE id=$3 RETURNING *", values: ["Luke", "engineer", 1] });
    })
    
});
