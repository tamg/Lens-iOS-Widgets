
let SETTINGS = {
    SMALL: {
        PADDING: 2,
        TITLE_FONT_SIZE: 12,
        POST_CONTENT_SIZE: 12,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 12,
        NAME_FONT_SIZE: 12,
        HANDLE_FONT_SIZE: 10,
    },
    MEDIUM: {
        PADDING: 8,
        TITLE_FONT_SIZE: 12,
        POST_CONTENT_SIZE: 10,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 16,
        NAME_FONT_SIZE: 10,
        HANDLE_FONT_SIZE: 12,
    },
    LARGE: {
        PADDING: 8,
        TITLE_FONT_SIZE: 14,
        POST_CONTENT_SIZE: 12,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 15,
        NAME_FONT_SIZE: 9,
        HANDLE_FONT_SIZE: 12,
    }
};
const createErrorText = (widget, profileHandle) => {
    let containerStack = widget.addStack();
    containerStack.layoutVertically();
    containerStack.addSpacer();
    let errorTextStack = containerStack.addStack();
    let errorText = errorTextStack.addText(`Error: please make sure your parameters are correct`);
    errorText.font = Font.mediumSystemFont(13);
    errorText.lineLimit = 4;
    containerStack.addSpacer();
    // widget.presentLarge()
};
const getProfileId = async (profileHandle) => {
    let profileQuery = `{
		profile(request: { handle: "${profileHandle}" }) {
			id
		}
	}`;
    const url = `https://api.lens.dev/graphql`;
    const req = RequestWithTimeout(url);
    req.method = 'POST';
    req.headers = {
        "Content-Type": "application/json"
    };
    req.body = JSON.stringify({
        query: profileQuery
    });
    const res = await req.loadJSON();
    let profileId = '';
    if (res.data && res.data.profile !== null) {
        profileId = res.data.profile.id;
        return profileId;
    }
    else {
        return null;
    }
};
const getExploreFeed = async (profileHandle, limit) => {
    let explore_feed = `{
		publications(
			request: { 
        profileId: "${profileHandle}", 
        publicationTypes: [POST], 
        limit: ${limit}, 
        metadata: { 
          mainContentFocus: [IMAGE]} 
        }
		) {
			items {
				__typename
				... on Post {
					id
					profile {
						id
						name
						handle
						picture {
							... on MediaSet {
								original {
									url
									mimeType
								}
							}
						}
					}
					metadata {
						name
						description
						content
						media {
							original {
								url
								mimeType
							}
						}
					}
				}
			}
		}
	}`;
    const url = `https://api.lens.dev/graphql`;
    const req = RequestWithTimeout(url);
    req.method = 'POST';
    req.headers = {
        "Content-Type": "application/json"
    };
    req.body = JSON.stringify({
        query: explore_feed
    });
    const res = await req.loadJSON();
    let publicationsData = [];
    if (res.data && res.data.publications !== null) {
        publicationsData = res.data.publications.items;
        return publicationsData;
    }
    else {
        return null;
    }
};
const createSmallWidget = async (widget, profileHandle, profileId) => {
    let publicationsData = await getExploreFeed(profileId, 8);
    const random = Math.floor(Math.random() * publicationsData.length);
    let selectedPost = publicationsData[random];
    if (publicationsData == null) {
        createErrorText(widget);
        return widget;
    }
    let { PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.SMALL;
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let mainStack = widget.addStack();
    mainStack.layoutVertically();
    mainStack.addSpacer();
    let headerStack = mainStack.addStack();
    headerStack.size = new Size(180, 60);
    let profilePictureUrl = '';
    try {
        profilePictureUrl = selectedPost.profile.picture.original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    catch (error) {
        console.error(error);
        console.error(selectedPost.profile);
        if (selectedPost.profile.name !== null) {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${selectedPost.profile.name.substring(0, 3)}&length=1`;
        }
        else {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${selectedPost.profile.handle.substring(0, 3)}&length=1`;
        }
    }
    let profilePic = await loadImageReq(profilePictureUrl);
    let imageStack = headerStack.addStack();
    imageStack.setPadding(10, 20, 0, 5);
    let ProfilePhoto = imageStack.addImage(profilePic);
    ProfilePhoto.imageSize = new Size(40, 40);
    ProfilePhoto.cornerRadius = 40 / 2;
    let titleStack = headerStack.addStack();
    titleStack.layoutVertically();
    let titleStackContainer = titleStack.addStack();
    titleStackContainer.addSpacer();
    titleStackContainer.layoutVertically();
    let title = titleStackContainer.addText(`${selectedPost.profile.name}`);
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStackContainer.addStack();
    let profileHandleText = titleStackContainer.addText(`@${profileHandle}`);
    profileHandleText.font = Font.boldRoundedSystemFont(HANDLE_FONT_SIZE);
    headerStack.addSpacer();
    titleStackContainer.addSpacer();
    let postMediaUrl = '';
    if (selectedPost.metadata.media[0].original.url) {
        postMediaUrl = selectedPost.metadata.media[0].original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    let postMedia = await loadImageReq(postMediaUrl);
    widget.backgroundImage = postMedia;
    widget.presentSmall();
};
const createMediumWidget = async (widget, profileHandle, profileId) => {
    let publicationsData = await getExploreFeed(profileId, 8);
    const random = Math.floor(Math.random() * publicationsData.length);
    let selectedPost = publicationsData[random];
    if (publicationsData == null) {
        createErrorText(widget);
        return widget;
    }
    let { PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.LARGE;
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let mainStack = widget.addStack();
    mainStack.layoutVertically();
    mainStack.addSpacer();
    let headerStack = mainStack.addStack();
    headerStack.size = new Size(350, 70);
    let profilePictureUrl = '';
    try {
        profilePictureUrl = selectedPost.profile.picture.original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    catch (error) {
        console.error(error);
        console.error(selectedPost.profile);
        if (selectedPost.profile.name !== null) {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${selectedPost.profile.name.substring(0, 3)}&length=1`;
        }
        else {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${selectedPost.profile.handle.substring(0, 3)}&length=1`;
        }
    }
    let profilePic = await loadImageReq(profilePictureUrl);
    let imageStack = headerStack.addStack();
    imageStack.setPadding(10, 20, 10, 15);
    let ProfilePhoto = imageStack.addImage(profilePic);
    ProfilePhoto.imageSize = new Size(50, 50);
    ProfilePhoto.cornerRadius = 50 / 2;
    let titleStack = headerStack.addStack();
    titleStack.layoutVertically();
    let titleStackContainer = titleStack.addStack();
    titleStackContainer.addSpacer();
    titleStackContainer.layoutVertically();
    let title = titleStackContainer.addText(`${selectedPost.profile.name}`);
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStackContainer.addStack();
    let profileHandleText = titleStackContainer.addText(`@${profileHandle}`);
    profileHandleText.font = Font.boldRoundedSystemFont(HANDLE_FONT_SIZE);
    headerStack.addSpacer();
    titleStackContainer.addSpacer();
    let postMediaUrl = '';
    if (selectedPost.metadata.media[0].original.url) {
        postMediaUrl = selectedPost.metadata.media[0].original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    let postMedia = await loadImageReq(postMediaUrl);
    widget.backgroundImage = postMedia;
    widget.presentMedium();
};
const createLargeWidget = async (widget, profileHandle, profileId) => {
    let publicationsData = await getExploreFeed(profileId, 8);
    const random = Math.floor(Math.random() * publicationsData.length);
    let selectedPost = publicationsData[random];
    if (publicationsData == null) {
        createErrorText(widget);
        return widget;
    }
    let { PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.LARGE;
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let mainStack = widget.addStack();
    mainStack.layoutVertically();
    mainStack.addSpacer();
    let headerStack = mainStack.addStack();
    headerStack.size = new Size(350, 70);
    let profilePictureUrl = '';
    try {
        profilePictureUrl = selectedPost.profile.picture.original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    catch (error) {
        console.error(error);
        console.error(selectedPost.profile);
        if (selectedPost.profile.name !== null) {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${selectedPost.profile.name.substring(0, 3)}&length=1`;
        }
        else {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${selectedPost.profile.handle.substring(0, 3)}&length=1`;
        }
    }
    let profilePic = await loadImageReq(profilePictureUrl);
    let imageStack = headerStack.addStack();
    imageStack.setPadding(10, 20, 10, 15);
    let ProfilePhoto = imageStack.addImage(profilePic);
    ProfilePhoto.imageSize = new Size(50, 50);
    ProfilePhoto.cornerRadius = 50 / 2;
    let titleStack = headerStack.addStack();
    titleStack.layoutVertically();
    let titleStackContainer = titleStack.addStack();
    titleStackContainer.addSpacer();
    titleStackContainer.layoutVertically();
    let title = titleStackContainer.addText(`${selectedPost.profile.name}`);
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStackContainer.addStack();
    let profileHandleText = titleStackContainer.addText(`@${profileHandle}`);
    profileHandleText.font = Font.boldRoundedSystemFont(HANDLE_FONT_SIZE);
    headerStack.addSpacer();
    titleStackContainer.addSpacer();
    let postMediaUrl = '';
    if (selectedPost.metadata.media[0].original.url) {
        postMediaUrl = selectedPost.metadata.media[0].original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    let postMedia = await loadImageReq(postMediaUrl);
    widget.backgroundImage = postMedia;
    widget.presentLarge();
};
const loadImageReq = async (url) => {
    let imageReq = new Request(url);
    let image = await imageReq.loadImage();
    return image;
};
const createWidget = async () => {
    const curated = ["goodkrak", "visualswithsam", "evanmann", "andresbriceno", "klepikovadaria", "pilotmji", "b_shep", "cemal_cetin", "reluctant_lemonade", "j3r3m", "zospours"];
    const curated_pick = curated[Math.floor(Math.random() * curated.length)];
    // switch (profileHandle) {
    // 	case null:
    //     profileHandle = "lensprotocol"
    // 		break
    // 	case 'lensprotocol':
    //     profileHandle = "lensprotocol"
    // 		break
    // 	case 'large':
    // 		await createLargeWidget(widget, profileHandle, profileId)
    // 		break
    // }
    // if (profileHandle == null || profileHandle == "lensprotocol") {
    // 	profileHandle = "lensprotocol"
    // } else {
    // 	profileHandle += ".lens"
    // }
    let profileHandle = curated_pick + ".lens";
    let profileId = await getProfileId(profileHandle);
    let widget = new ListWidget();
    let widgetSize = config.widgetFamily || "medium";
    switch (widgetSize) {
        case "small":
            await createSmallWidget(widget, profileHandle, profileId);
            break;
        case 'medium':
            await createMediumWidget(widget, profileHandle, profileId);
            break;
        case 'large':
            await createLargeWidget(widget, profileHandle, profileId);
            break;
    }
    return widget;
};
const RequestWithTimeout = (url, timeoutSeconds = 5) => {
    const request = new Request(url);
    request.timeoutInterval = timeoutSeconds;
    return request;
};

let widget = await createWidget(args.widgetParameter)
Script.setWidget(widget)
Script.complete()