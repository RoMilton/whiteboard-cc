import Galleries from './collections/Galleries.js';
import ActiveUsers from './collections/ActiveUsers.js';


Meteor.publish('galleries',function([galleryId]){
	return Galleries.find(
		{galleryId: galleryId},
		{fields: { 'iSelectedBoard' : 1, 'galleryName' : 1, 'lastUpdatedBy' : 1 }}
	);
});

Meteor.publish('activeUsers',function([galleryId]){
	return ActiveUsers.find({galleryId: galleryId});
});