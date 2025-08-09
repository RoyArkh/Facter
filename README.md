# Facter

## TODO
- [x] Add the full guide in readme
- [ ] Update readme with full description of the project.
- [ ] Upgrade UI
- [ ] Create a presentation
- [ ] Gather feedback
- [ ] Make a demo video

## Mission 


## User's Setup guide
### Your Engine
Your engine - is going to be the broad ddatabase of information that is going to be useful to you. If you want to use Facter for general fact checking it makes sense to include trusted sources like FactCheck.org or community websites like Wikipedia which have a lot of infromation. Many countries have a lis of trusted sources with regards to their regions, you can find those online.

#### How to setup the engine
First choose the sources that will be suitable for you goal. For example for this test scenario I will choose the following:
*.wikipedia.org/*
cloud.google.com/*
www.encyclopedia.com/*

Then head to https://developers.google.com/custom-search/v1/overview

Here you will see the following page with instructions:
![Google developers page](assets/image2.png)


Click on "Programmable Search Engine control panel" (this will take you to https://programmablesearchengine.google.com/controlpanel/overview) and there click on "Add"

![Programmable Search Engine overview](assets/image3.png)

Name your engine, paste the websites you previously decided on, then click on "Create". 

You will get a confirmation screen, there click on Customize and in the page that opens in the overview you will see your search engine ID. Save that.

![Programmable Search Engine overview](assets/image4.png)
![Programmable Search Engine overview](assets/image5.png)

Great! Now you have your search base!

#### The API key

Return to the previous page (https://developers.google.com/custom-search/v1/overview) and in the API key section press on "Get a Key". API keys bound to a service account provide the identity and authorization of the service account to a request, so this key will be your unique identifier for this service. 

In the "Select or create project" choose "create a new project" and give it a name. Then press next. 
 
![Programmable Search Engine overview](assets/image6.png)

You will be shown a button "SHOW KEY". Press that and save your new API key. Make sure it is stored securely.


#### Gemini access

While Facter can we user without AI, it makes the user experience much more complete. Therefore, you need to go to https://aistudio.google.com/app/apikey click on "Create API key" and choose the project we previously created. 

![Programmable Search Engine overview](assets/image7.png)

Save your API key and store it safely. 

**You are all set!** **Just paste those into Facter and get the truth!**

