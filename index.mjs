import superagent from 'superagent';
import _ from 'lodash';

const issuesUrl = 'https://api.github.com/repos/woocommerce/facebook-for-woocommerce/issues';

// TODO Allow passing in a token as arg or env.
// https://www.npmjs.com/package/dotenv
// You'll need an API token for private repos or if you hit rate limits.
const githubApiToken = '';

function logIssuesAsMarkdownLinks( title, issues ) {
	console.log( '' );
	console.log( `## \`${ title }\` (${ issues.length })` );

	issues.forEach( issue => {
		const markdown = `- [${ issue.title }](${ issue.html_url })`;
		console.log(markdown);
	} );
}

function issuesWithLabel( issues, labelId ) {
	return issues.filter( issue => {
		return _.some(
			issue.labels,
			{ id: labelId }
		);
	} );
}

async function main() {

	let issuesAndPrs = [];
	// Pagination is 1-based. https://docs.github.com/en/rest/guides/traversing-with-pagination
	let page = 1;
	let returned;

	const requestHeaders = {
		'User-Agent': 'custom-node-js',
	}
	if ( githubApiToken ) {
		requestHeaders['Authorization'] = `token ${ githubApiToken }`;
	}

	do {
		const response = await superagent
		.get( issuesUrl )
		.query( {
			'per_page': 100,
			'state': 'open',
			'page': page,
		} )
		.set( requestHeaders );

		returned = response.body.length;
		issuesAndPrs.push( ...response.body );

		console.log( `Page ${ page } returned ${ returned } issues/PRs.` );
		page++;
	} while ( returned > 0 );

	const issues = issuesAndPrs.filter( issue => ! issue.pull_request );

	console.log( `${ issues.length } issues found of ${ issuesAndPrs.length } total issues/PRs.` );

	console.log( '' );
	console.log( '' );

	// Hard coded labels and IDs.
	// Get label IDs from GitHub API.
	// https://api.github.com/repos/woocommerce/facebook-for-woocommerce/labels?per_page=100

	console.log( `# Issues by feature`);

	logIssuesAsMarkdownLinks(
		'feature: onboarding',
		issuesWithLabel( issues, 2843842211 ),
	);
	logIssuesAsMarkdownLinks(
		'feature: product sync',
		issuesWithLabel( issues, 2843843086 ),
	);
	logIssuesAsMarkdownLinks(
		'feature: pixel events',
		issuesWithLabel( issues, 2915617904 ),
	);
	logIssuesAsMarkdownLinks(
		'feature: messenger',
		issuesWithLabel( issues, 2915621240 ),
	);
	logIssuesAsMarkdownLinks(
		'feature: ads',
		issuesWithLabel( issues, 2915619247 ),
	);

	console.log( '' );
	console.log( '' );

	console.log( `# Issues by type`);

	logIssuesAsMarkdownLinks(
		'type: bug',
		issuesWithLabel( issues, 2843825328 ),
	);
	logIssuesAsMarkdownLinks(
		'type: enhancement',
		issuesWithLabel( issues, 2843825896 ),
	);
	logIssuesAsMarkdownLinks(
		'type: task',
		issuesWithLabel( issues, 2918575116 ),
	);
	logIssuesAsMarkdownLinks(
		'type: documentation',
		issuesWithLabel( issues, 2843828113 ),
	);
	logIssuesAsMarkdownLinks(
		'type: question',
		issuesWithLabel( issues, 2843829494 ),
	);

}



console.log( 'starting' );
await main();
