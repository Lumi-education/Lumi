export const init = {
	'_id': 'init',
	'source':  'http://devdb.lumi.education/init',
	'target':  ( (process.env.DB_HOST || 'http://localhost:5984') + '/' + (process.env.DB || 'lumidb') ),
	'continuous':  true,
	'create_target':  true
};