#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
	{
		name: "project-choice",
		type: 'list',
		message: "What project template would you like to generate?",
		choices: CHOICES
	},
	{
		name: "project-name",
		type: 'input',
		message: 'Project Name: ',
		validate: function (input) {
     		if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      		else return 'Project name may only include letters, numbers, underscores and hashes.';
    	}	
	}
]


const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS)
	.then(answers => {
		const project_choice = answers['project-choice'];
		const project_name   = answers['project-name'];
		const template_path  = `${__dirname}/templates`;

		fs.mkdirSync(`${CURR_DIR}/${project_name}`);

		createDirectoryContents(template_path, project_name);
	});

function createDirectoryContents (templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
      
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
      
      // recursive call
      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
}