Backend Readme

Models:

User
	username: STRING
	password: STRING
	Folders: [ID]

Folders
	Chats: [ID]
	Title: STRING 
	
Zapchats
	subject: STRING
	users: [ID]
	Zaps: [ID]
	Authors: [ID]
	hasSeen: Boolean

full crud on all of these aspects

technologies: js, express, cors, socket potentially
