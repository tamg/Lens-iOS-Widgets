
let COLOR = {
    GREY: Color.dynamic(new Color("#ECECEC"), new Color("#2A2A2A")),
    LIGHTGREY: new Color("#949494")
};
let SETTINGS = {
    SMALL: {
        BG_COLOR: "#151515",
        PADDING: 2,
        TITLE_FONT_SIZE: 14,
        POST_CONTENT_SIZE: 12,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 12,
        NAME_FONT_SIZE: 12,
        HANDLE_FONT_SIZE: 11,
    },
    MEDIUM: {
        BG_COLOR: "#151515",
        PADDING: 8,
        TITLE_FONT_SIZE: 12,
        POST_CONTENT_SIZE: 10,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 16,
        NAME_FONT_SIZE: 10,
        HANDLE_FONT_SIZE: 12,
    },
    LARGE: {
        BG_COLOR: "#151515",
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
const createSmallPostItem = async (post, feedContainerStack) => {
    let { STAT_FONT_SIZE, NAME_FONT_SIZE, POST_CONTENT_SIZE } = SETTINGS.SMALL;
    let postStack = feedContainerStack.addStack();
    postStack.layoutHorizontally();
    let postContentStack = postStack.addStack();
    postContentStack.addSpacer();
    postContentStack.layoutVertically();
    let profileNameStack = postContentStack.addStack();
    let profileNameText = post.profile.name == null ? post.profile.handle : post.profile.name;
    let profileName = profileNameStack.addText(profileNameText);
    profileName.font = Font.mediumSystemFont(NAME_FONT_SIZE);
    profileName.textColor = COLOR.LIGHTGREY;
    profileNameStack.addSpacer(5);
    profileNameStack.setPadding(0, 0, 5, 0);
    let postContentText = post.metadata.content.replace(/\n/g, '');
    if (postContentText.length > 80) {
        postContentText = postContentText.substring(0, 80) + ' ...';
    }
    let postContent = postContentStack.addText(postContentText);
    postContent.font = Font.mediumSystemFont(POST_CONTENT_SIZE);
    postContentStack.centerAlignContent();
    postContentStack.addSpacer();
};
const createMediumPostItem = async (post, feedContainerStack) => {
    let { STAT_FONT_SIZE, NAME_FONT_SIZE, POST_CONTENT_SIZE } = SETTINGS.LARGE;
    let postStack = feedContainerStack.addStack();
    postStack.layoutHorizontally();
    postStack.url = `https://lenster.xyz/posts/${post.id}`;
    let profilePictureUrl = '';
    try {
        profilePictureUrl = post.profile.picture.original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    catch (error) {
        console.error(error);
        console.error(post.profile);
        if (post.profile.name !== null) {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${post.profile.name.substring(0, 3)}&length=1`;
        }
        else {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${post.profile.handle.substring(0, 3)}&length=1`;
        }
    }
    let profilePic = await loadImageReq(profilePictureUrl);
    let imageStack = postStack.addStack();
    imageStack.setPadding(10, 10, 10, 10);
    let ProfilePhoto = imageStack.addImage(profilePic);
    ProfilePhoto.imageSize = new Size(40, 40);
    ProfilePhoto.cornerRadius = 40 / 2;
    ProfilePhoto.applyFillingContentMode();
    let postContentStack = postStack.addStack();
    postContentStack.addSpacer();
    postContentStack.layoutVertically();
    let profileNameStack = postContentStack.addStack();
    let profileNameText = post.profile.name == null ? "" : post.profile.name + ' | ';
    let profileHandleText = post.profile.handle;
    let profileName = profileNameStack.addText(profileNameText + '@' + profileHandleText);
    profileName.font = Font.mediumSystemFont(NAME_FONT_SIZE);
    profileName.textColor = COLOR.LIGHTGREY;
    profileNameStack.addSpacer(5);
    profileNameStack.setPadding(0, 0, 5, 0);
    let postContentText = post.metadata.content.replace(/\n/g, '');
    if (postContentText.length > 80) {
        postContentText = postContentText.substring(0, 80) + ' ...';
    }
    let postContent = postContentStack.addText(postContentText);
    postContent.font = Font.mediumSystemFont(POST_CONTENT_SIZE);
    postContentStack.centerAlignContent();
    postContentStack.addSpacer();
};
const createLargePostItem = async (post, feedContainerStack) => {
    let { STAT_FONT_SIZE, NAME_FONT_SIZE, POST_CONTENT_SIZE } = SETTINGS.LARGE;
    let postStack = feedContainerStack.addStack();
    postStack.layoutHorizontally();
    postStack.url = `https://lenster.xyz/posts/${post.id}`;
    let profilePictureUrl = '';
    try {
        profilePictureUrl = post.profile.picture.original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    catch (error) {
        console.error(error);
        console.error(post.profile);
        if (post.profile.name !== null) {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${post.profile.name.substring(0, 3)}&length=1`;
        }
        else {
            profilePictureUrl = `https://ui-avatars.com/api/?name=${post.profile.handle.substring(0, 3)}&length=1`;
        }
    }
    let profilePic = await loadImageReq(profilePictureUrl);
    let imageStack = postStack.addStack();
    imageStack.setPadding(12, 15, 10, 15);
    let ProfilePhoto = imageStack.addImage(profilePic);
    ProfilePhoto.imageSize = new Size(44, 44);
    ProfilePhoto.cornerRadius = 44 / 2;
    ProfilePhoto.applyFillingContentMode();
    let postContentStack = postStack.addStack();
    postContentStack.addSpacer();
    postContentStack.layoutVertically();
    let profileNameStack = postContentStack.addStack();
    let profileNameText = post.profile.name == null ? "" : post.profile.name + ' | ';
    let profileHandleText = post.profile.handle;
    let profileName = profileNameStack.addText(profileNameText + '@' + profileHandleText);
    profileName.font = Font.mediumSystemFont(NAME_FONT_SIZE);
    profileName.textColor = COLOR.LIGHTGREY;
    profileNameStack.addSpacer(10);
    profileNameStack.setPadding(0, 0, 5, 0);
    let postContentText = post.metadata.content.replace(/\n/g, '');
    if (postContentText.length > 80) {
        postContentText = postContentText.substring(0, 80) + ' ...';
    }
    let postContent = postContentStack.addText(postContentText);
    postContent.font = Font.mediumSystemFont(POST_CONTENT_SIZE);
    postContentStack.centerAlignContent();
    postContentStack.addSpacer();
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
    req.headers = { "Content-Type": "application/json" };
    req.body = JSON.stringify({ query: profileQuery });
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
			request: { profileId: "${profileHandle}", publicationTypes: [POST], limit: ${limit} }
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
							... on NftImage {
								contractAddress
								tokenId
								uri
								verified
							}
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
						attributes {
							displayType
							traitType
							value
						}
					}
				}
			}
		}
	}`;
    const url = `https://api.lens.dev/graphql`;
    const req = RequestWithTimeout(url);
    req.method = 'POST';
    req.headers = { "Content-Type": "application/json" };
    req.body = JSON.stringify({ query: explore_feed });
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
    let publicationsData = await getExploreFeed(profileId, 2);
    if (publicationsData == null) {
        createErrorText(widget);
        return widget;
    }
    let { PADDING, TITLE_FONT_SIZE } = SETTINGS.MEDIUM;
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let mainStack = widget.addStack();
    mainStack.layoutVertically();
    let headerStack = mainStack.addStack();
    headerStack.layoutVertically();
    headerStack.setPadding(7, 10, 5, 7);
    let titleStack = headerStack.addStack();
    titleStack.addSpacer();
    let title = titleStack.addText(`${profileHandle}'s feed`);
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStack.addSpacer();
    let line = mainStack.addStack();
    line.backgroundColor = Color.dynamic(new Color("#ECECEC"), new Color("#2A2A2A"));
    line.size = new Size(145, 1);
    let feedContainerStack = mainStack.addStack();
    feedContainerStack.layoutHorizontally();
    feedContainerStack.setPadding(0, 10, 0, 2);
    await createSmallPostItem(publicationsData[0], feedContainerStack);
    mainStack.url = `https://lenster.xyz/posts/${publicationsData[0].id}`;
    widget.presentSmall();
};
const createMediumWidget = async (widget, profileHandle, profileId) => {
    let publicationsData = await getExploreFeed(profileId, 2);
    console.log(publicationsData);
    if (publicationsData == null) {
        createErrorText(widget);
        return widget;
    }
    let { PADDING, TITLE_FONT_SIZE } = SETTINGS.MEDIUM;
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let mainStack = widget.addStack();
    mainStack.layoutVertically();
    let headerStack = mainStack.addStack();
    headerStack.layoutVertically();
    headerStack.setPadding(7, 10, 5, 7);
    let titleStack = headerStack.addStack();
    titleStack.addSpacer();
    let title = titleStack.addText(`${profileHandle}'s feed`);
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStack.addSpacer();
    let feedContainerStack = mainStack.addStack();
    feedContainerStack.layoutVertically();
    for (const item of publicationsData) {
        let line = feedContainerStack.addStack();
        line.backgroundColor = Color.dynamic(new Color("#ECECEC"), new Color("#2A2A2A"));
        line.size = new Size(350, 1);
        await createMediumPostItem(item, feedContainerStack);
    }
    widget.presentMedium();
};
const createLargeWidget = async (widget, profileHandle, profileId) => {
    let publicationsData = await getExploreFeed(profileId, 4);
    if (publicationsData == null) {
        createErrorText(widget);
        return widget;
    }
    let { PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.LARGE;
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let mainStack = widget.addStack();
    mainStack.layoutVertically();
    let headerStack = mainStack.addStack();
    headerStack.layoutVertically();
    headerStack.setPadding(10, 10, 5, 10);
    let titleStack = headerStack.addStack();
    titleStack.addSpacer();
    let title = titleStack.addText("Explore Feed");
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStack.addSpacer();
    let profileHandleStack = headerStack.addStack();
    profileHandleStack.addSpacer();
    let profileHandleText = profileHandleStack.addText(`${profileHandle}'s feed`);
    profileHandleText.font = Font.boldRoundedSystemFont(HANDLE_FONT_SIZE);
    profileHandleStack.addSpacer();
    let feedContainerStack = mainStack.addStack();
    feedContainerStack.layoutVertically();
    feedContainerStack.addSpacer(10);
    for (const item of publicationsData) {
        let line = feedContainerStack.addStack();
        line.backgroundColor = Color.dynamic(new Color("#ECECEC"), new Color("#2A2A2A"));
        line.size = new Size(350, 1);
        await createLargePostItem(item, feedContainerStack);
    }
    widget.presentLarge();
};
const loadImageReq = async (url) => {
    let imageReq = new Request(url);
    let image = await imageReq.loadImage();
    return image;
};
const createWidget = async (profileHandle) => {
    if (profileHandle == null || profileHandle == "lensprotocol") {
        profileHandle = "lensprotocol";
    }
    else {
        profileHandle += ".lens";
    }
    let profileId = await getProfileId(profileHandle);
    let widget = new ListWidget();
    let widgetSize = config.widgetFamily || "large";
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