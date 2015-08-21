exports.findAll = function(req, res) {
    res.send({x:["7:00", "7:05","7:10"], tier1:[99,98,97], tier2:[96,95,94], concurrency:[0,0,1000], cluster:[0,0,750]});
    };

exports.findById = function(req, res) {
        res.send({id:req.params.id, name: "The Name", description: "description"});
	};
