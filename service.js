exports.findAll = function(req, res) {
    	res.header("Content-Type", "application/json");
	res.send({x:["7:00", "8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00", "17:00","18:00"], tier1:[99,98,97,99,98,97,99,98,97,99,98,97], tier2:[96,95,94,96,95,94,96,95,94,96,95,94], concurrency:[0,0,0,1000,0,0,1000,0,0,1000,0,1000], cluster:[0,0,750,0,0,750,0,0,750,0,0,750]});
    };

exports.findById = function(req, res) {
        res.send({id:req.params.id, name: "The Name", description: "description"});
	};
