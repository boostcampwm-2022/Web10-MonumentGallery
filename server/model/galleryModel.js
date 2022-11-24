import { startSession } from "mongoose";
import Gallery from "../schema/gallerySchema.js";
import User from "../schema/userSchema.js";

async function loadGalleryHistory(userID) {
	const isExists = await User.exists({userID});
	if(isExists) {
		const data = await User.findOne({userID});
		return data.history;
	}
	return {};
}

async function updateUserGallery(userID, galleryID) {
	const isExists = await User.exists({userID});
	const now = Date.now();

	if(isExists) {
		const history = await loadGalleryHistory(userID);
		history[galleryID] = now;
		return User.findOneAndUpdate({userID}, {history});
	}
	return User.create({
		userID,
		isShared: false,
		lastShareModified: now,
		lastModified: now,
		history: {galleryID: now}
	});
}

async function loadShareStatus(userID) {
	const isExists = await User.exists({userID});
	if(isExists) {
		const data = await User.findOne({userID});
		return data.isShared;
	}
	return null;
}

async function saveGallery(userID, galleryData) {
	const session = await startSession();
	try {
		session.startTransaction();
		const { _id } = await Gallery.create(galleryData);
		await updateUserGallery(userID, _id);
		await session.commitTransaction();
		session.endSession();
		return _id;
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		return null;
	}
}

async function loadGallery(userID, galleryID) {
	if(typeof galleryID !== "string" || galleryID.length !== 24) {
		return { success: false, err: "bad_request" };
	}
	if (await User.exists({userID}) === false) return { success: false, err: "not_found" };

	const { history } = await User.findOne({userID});
	if ( history[galleryID] === undefined ) return { success: false, err: "not_found" };

	const galleryData = await Gallery.findById(galleryID);
	if (galleryData === null) return { success: false, err: "not_found" };

	return { success: true, data: galleryData };
}

async function loadLastGalleryID(userID) {
	const history = await loadGalleryHistory(userID);
	const [result] = Object.entries(history).reduce( ([rescentID, rescentDate], [galleryID, date])=>{
		if(rescentDate > date) return [galleryID, date];
		return [rescentID, rescentDate];
	}, [null, 0] );

	return result;
}

async function loadLastGallery(userID) {
	const galleryID = loadLastGalleryID(userID);
	if (galleryID === null) return null;
	return await Gallery.findById(galleryID);
}

export { 
	getShareStatus, 
	saveGallery, 
	loadGallery, 
	loadLastGallery, 
	loadLastGalleryID, 
	loadGalleryHistory as loadUserGalleryList 
};