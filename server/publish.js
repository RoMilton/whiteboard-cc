import Galleries from './collections/Galleries.js';
import ActiveUsers from './collections/ActiveUsers.js';
/**
* Meteor's Publish informs clients when DB collections have been updated
*/

// Galleries collection
Meteor.publish('galleries',function([galleryId]){
	return Galleries.find(
		{galleryId: galleryId},
		{fields: { 'iSelectedBoard' : 1, 'galleryName' : 1, 'lastUpdatedBy' : 1 }}
	);
});

// ActiveUsers collection
Meteor.publish('activeUsers',function([galleryId]){
	return ActiveUsers.find({galleryId: galleryId});
});