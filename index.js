const fs = require('fs');
const https = require('https');
const exec = require('child_process').execSync;
const args = process.argv.slice(2);
const auth = `bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik4wUkVRMFk0UXpjMk1FTkdOMEUxTVRGQ1JVWkVRa1pGUWpVNVJURkZRVFV4UVRBM05qZEJOZyJ9.eyJodHRwczovL2FwaS5wcm9kLmhlYWRzcGFjZS5jb20vY29ubmVjdGlvbiI6InVzZXIgcGFzc3dvcmQgaGVhZHNwYWNlIiwiaHR0cHM6Ly9hcGkucHJvZC5oZWFkc3BhY2UuY29tL2hzSWQiOiJIU1VTRVJfVENRNFNVNlZaQldHVjVITVYiLCJodHRwczovL2FwaS5wcm9kLmhlYWRzcGFjZS5jb20vdjJBcGlLZXkiOiJuQnVrVTlUS1NHcEczRWRobTdGNDlKeklDSlFxTDM3SmVDaTR5UG93d3dZPSIsImh0dHBzOi8vYXBpLnByb2QuaGVhZHNwYWNlLmNvbS9oc1BsYXRmb3JtIjoiREVTS1RPUCIsImlzcyI6Imh0dHBzOi8vYXV0aC5oZWFkc3BhY2UuY29tLyIsInN1YiI6ImF1dGgwfDVlNDQ4M2M4ZWE2NWViMGU4ODU5NzRjNSIsImF1ZCI6WyJodHRwczovL2FwaS5wcm9kLmhlYWRzcGFjZS5jb20iLCJodHRwczovL2IyYy1wcm9kLWhlYWRzcGFjZS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNTgxNjUwMjg2LCJleHAiOjE1ODE3MzY2ODYsImF6cCI6InhrUVkxSTBSZ2Z4UGhDTnRKWjcwY2Q4b1R6eW1EVDFyIiwic2NvcGUiOiJvcGVuaWQgZW1haWwifQ.S3DjRI2pRjzIgJV58OmAa7KcAiZVLq3KOIVy_YxFtXvrtI2buGxhwS0BUZ-DPJWBQmWuNVdN2ZBPR5aJttrmDjf8VyKhxUKSE357MQ5wxqemHGZIYVd8hDQ8Rbfz2JCrbHysXrMesjK1Cj3Tbg98h2KlO8TvVkaEuzl3v5AGZgR5WOJIyoJ9eifuo6f55bjo5N9cX6-7iKYZUoQgGijDNU5qmiU75HdKn0ZNoWnKUY8NoVaqgkgyXzbNFryWkKb3RYAN2hCdqFMTsuBNFFB3tAW3T8aQ0hRXGd6_j9-ySRsFc1PpqxYXBjdjZYXG6cMj2GRCsC9Vazi8rb36gsaFnA`;
https.get(`https://api.prod.headspace.com/content/media-items/${args[0]}/make-signed-url`, { headers: { authorization: auth } }, jsonReqStream => {
	const buffers = [];
	jsonReqStream.on('data', b => buffers.push(b));
	jsonReqStream.on('end', () => {
		const jsonData = JSON.parse(Buffer.concat(buffers));
		const jsonUrl = jsonData.url;
		jsonUrl && https.get(jsonUrl, fileReqStream => {
			const fileName = jsonUrl.substring(jsonUrl.lastIndexOf('/') + 1, jsonUrl.indexOf('?'));
			const filePath = `Files/${fileName}`;
			const fileStream = fs.createWriteStream(filePath);
			fileReqStream.pipe(fileStream, { end: false });
			fileReqStream.on('end', () => {
				fileStream.close();
				setTimeout(() => {
					console.log(filePath);
					exec(`start "" "${filePath}"`);
				}, 666);
			});
		});
	});
})