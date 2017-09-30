export const init = {
	"_id": "init",
	"source":  "http://devdb.lumi.education/init",
	"target":  (process.env.DB_HOST+'/'+process.env.DB),
	"continuous":  true,
	"create_target":  true
};