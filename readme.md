# OSFC

## Requirements

Node Version 12

## Get started

Run `npm install` and start the server with `npm start`.

## Navigation

Once Speaker, TalkList, Schedule, CFP or Tickets are needed, just add the desired point to the 'navigation.json':

{
"text": "CFP",
"url": "enter the link you need here!"
},
{
"text": "Tickets",
"url": "enter the link you need here!"
},
{
"text": "Talk List / Schedule",
"url": "/2022/talk-list/"
},
{
"text": "Schedule",
"url": "/2022/schedule/"
}

Let Nils or Denise know beforehand, so we can add the '2022' folder accordingly.

### Venue Infos

In case you want to change the information regarding the venue, head to the home.html, there you find a section with the ID 'venue'. Here you can add/edit the paragraphs and change the image (you need to upload that beforehand).

### Sorting Team, Projects, Sponsors, ...

Head to 'dataSorting.json' to change the order. All projects, team members, etc. which are not mentioned here, will be displayed in the order they have been added.

### Images

Upload the images in the 'image' folder and then add to the [year].json this:
Either landscape or Portrait depending on the format.

"gallery": [
{
"img": "Image-Path",
"alt": "Image Alt-Tag",
"format": "landscape"
},
{
"img": "Image-Path",
"alt": "Image Alt-Tag",
"format": "portrait"
}
]

### For Design-Team:

Once the Sponsors will be display again, change the beams again.

Organizer::before: {
@include media-query("xl") {
top: -5rem;
}
}
