// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
let SETTINGS = {
    SMALL: {
        BG_COLOR: "#151515",
        BG_IMAGE: {
            SHOW_BG: false,
            IMAGE_PATH: "bg.png",
        },
        BG_OVERLAY: {
            SHOW_OVERLAY: false,
            OVERLAY_COLOR: "#111111",
            OPACITY: 0.9,
        },
        PADDING: 2,
        TITLE_FONT_SIZE: 14,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 12,
        NAME_FONT_SIZE: 10,
        HANDLE_FONT_SIZE: 11,
        RANDOMIZE_CONTACTS: false,
    },
    MEDIUM: {
        BG_COLOR: "#151515",
        BG_IMAGE: {
            SHOW_BG: false,
            IMAGE_PATH: "bg.png",
        },
        BG_OVERLAY: {
            SHOW_OVERLAY: false,
            OVERLAY_COLOR: "#111111",
            OPACITY: 0.5,
        },
        PADDING: 8,
        TITLE_FONT_SIZE: 16,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 16,
        NAME_FONT_SIZE: 10,
        HANDLE_FONT_SIZE: 12,
        RANDOMIZE_CONTACTS: false,
    },
    LARGE: {
        BG_COLOR: "#151515",
        BG_IMAGE: {
            SHOW_BG: false,
            IMAGE_PATH: "bg.png",
        },
        BG_OVERLAY: {
            SHOW_OVERLAY: false,
            OVERLAY_COLOR: "#111111",
            OPACITY: 0.5,
        },
        PADDING: 8,
        TITLE_FONT_SIZE: 16,
        PHOTO_SIZE: 60,
        STAT_FONT_SIZE: 15,
        NAME_FONT_SIZE: 10,
        HANDLE_FONT_SIZE: 12,
        RANDOMIZE_CONTACTS: false,
    }
  };
  const createErrorText = (widget, lensHandle) => {
    let containerStack = widget.addStack();
    containerStack.layoutVertically();
    containerStack.addSpacer();
    let errorTextStack = containerStack.addStack();
    let errorText = errorTextStack.addText(`Error: lens handle not found: is ${lensHandle} correct?`);
    errorText.font = Font.mediumSystemFont(13);
    errorText.lineLimit = 4;
    containerStack.addSpacer();
    // widget.presentLarge()
  };
  const createSmallStat = (stat, row) => {
    let { STAT_FONT_SIZE, NAME_FONT_SIZE } = SETTINGS.SMALL;
    let { title, data } = stat;
    row.setPadding(5, 12, 5, 3);
    let statStack = row.addStack();
    statStack.layoutHorizontally();
    let statDataStack = statStack.addStack();
    statStack.setPadding(3, 0, 3, 0);
    let statData = statDataStack.addText(data.toString());
    statData.font = Font.boldRoundedSystemFont(STAT_FONT_SIZE);
    statDataStack.addSpacer();
    statStack.addSpacer();
    let statTitleStack = statStack.addStack();
    let statTitle = statTitleStack.addText(title);
    statTitle.font = Font.mediumSystemFont(NAME_FONT_SIZE);
    statTitle.lineLimit = 1;
    statTitleStack.addSpacer();
  };
  const createMediumStat = (stat, row) => {
    let { STAT_FONT_SIZE, NAME_FONT_SIZE } = SETTINGS.MEDIUM;
    let { title, data } = stat;
    let statStack = row.addStack();
    statStack.layoutVertically();
    let statDataStack = statStack.addStack();
    statDataStack.addSpacer();
    let statData = statDataStack.addText(data.toString());
    statData.font = Font.boldRoundedSystemFont(STAT_FONT_SIZE);
    statDataStack.addSpacer();
    statStack.addSpacer(5);
    let statTitleStack = statStack.addStack();
    statTitleStack.addSpacer();
    let statTitle = statTitleStack.addText(title);
    statTitle.font = Font.mediumSystemFont(NAME_FONT_SIZE);
    statTitle.lineLimit = 1;
    statTitleStack.addSpacer();
  };
  const createLargeStat = (stat, row) => {
    let { STAT_FONT_SIZE, NAME_FONT_SIZE } = SETTINGS.LARGE;
    let { title, data } = stat;
    let statStack = row.addStack();
    statStack.layoutVertically();
    let statDataStack = statStack.addStack();
    statDataStack.addSpacer();
    let statData = statDataStack.addText(data.toString());
    statData.font = Font.boldRoundedSystemFont(STAT_FONT_SIZE);
    statDataStack.addSpacer();
    statStack.addSpacer(5);
    let statTitleStack = statStack.addStack();
    statTitleStack.addSpacer();
    let statTitle = statTitleStack.addText(title);
    statTitle.font = Font.mediumSystemFont(NAME_FONT_SIZE);
    statTitle.lineLimit = 1;
    statTitleStack.addSpacer();
  };
  const getProfileStats = async (lensHandle) => {
    let profile_query = `{
    profile(request: { handle: "${lensHandle}" }) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
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
        __typename
      }
      handle
      coverPicture {
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
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects 
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
        query: profile_query
    });
    const res = await req.loadJSON();
    let profileData = {};
    if (res.data && res.data.profile !== null) {
        let resStats = res.data.profile.stats;
        profileData = {
            profileStats: [
                {
                    title: 'Followers',
                    data: resStats.totalFollowers
                },
                {
                    title: 'Mirrors',
                    data: resStats.totalMirrors
                },
                {
                    title: 'Collects',
                    data: resStats.totalCollects
                },
                {
                    title: 'Comments',
                    data: resStats.totalComments
                },
                {
                    title: 'Following',
                    data: resStats.totalFollowing
                },
                {
                    title: 'Posts',
                    data: resStats.totalPosts
                },
                {
                    title: 'Publications',
                    data: resStats.totalPublications
                },
            ],
            profilePictureUrl: res.data.profile.picture.original.url.replace("ipfs://", "https://ipfs.io/ipfs/"),
            coverPictureUrl: res.data.profile.coverPicture.original.url
        };
        return profileData;
    }
    else {
        return null;
    }
  };
  const createSmallWidget = async (widget, profileData, lensHandle) => {
    let { BG_COLOR, BG_IMAGE, BG_OVERLAY, PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.SMALL;
    widget.backgroundColor = new Color(BG_COLOR);
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let containerStack = widget.addStack();
    containerStack.layoutVertically();
    containerStack.addSpacer();
    let titleStack = containerStack.addStack();
    titleStack.addSpacer();
    let title = titleStack.addText("Profile Stats");
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStack.addSpacer();
    let handleStack = containerStack.addStack();
    handleStack.addSpacer();
    let handle = handleStack.addText(`@${lensHandle}`);
    handle.font = Font.boldRoundedSystemFont(HANDLE_FONT_SIZE);
    handleStack.addSpacer();
    let statRowStack = containerStack.addStack();
    statRowStack.layoutVertically();
    statRowStack.addSpacer();
    profileData.profileStats.slice(0, 4).map(stat => {
        createSmallStat(stat, statRowStack);
    });
    statRowStack.addSpacer();
    widget.presentSmall();
  };
  const createMediumWidget = (widget, profileData, lensHandle) => {
    let { BG_COLOR, BG_IMAGE, BG_OVERLAY, PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.MEDIUM;
    widget.backgroundColor = new Color(BG_COLOR);
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let containerStack = widget.addStack();
    containerStack.layoutVertically();
    let titleStack = containerStack.addStack();
    titleStack.addSpacer();
    let title = titleStack.addText("Profile Stats");
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStack.addSpacer();
    let handleStack = containerStack.addStack();
    handleStack.addSpacer();
    let handle = handleStack.addText(`@${lensHandle}`);
    handle.font = Font.boldRoundedSystemFont(HANDLE_FONT_SIZE);
    handleStack.addSpacer();
    containerStack.addSpacer(35);
    let statRowStack = containerStack.addStack();
    statRowStack.centerAlignContent();
    statRowStack.addSpacer();
    profileData.profileStats.slice(0, 4).map(stat => {
        createMediumStat(stat, statRowStack);
    });
    statRowStack.addSpacer();
    widget.presentMedium();
  };
  const createLargeWidget = async (widget, profileData, lensHandle) => {
    let { BG_COLOR, BG_IMAGE, BG_OVERLAY, PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.LARGE;
    widget.setPadding(PADDING, PADDING, PADDING, PADDING);
    let containerStack = widget.addStack();
    containerStack.layoutVertically();
    let titleStack = containerStack.addStack();
    titleStack.addSpacer();
    let title = titleStack.addText("Profile Stats");
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);
    titleStack.addSpacer();
    let handleStack = containerStack.addStack();
    handleStack.addSpacer();
    let handle = handleStack.addText(`@${lensHandle}`);
    handle.font = Font.boldRoundedSystemFont(HANDLE_FONT_SIZE);
    handleStack.addSpacer();
    containerStack.addSpacer(10);
    let profilePictureUrl = profileData.profilePictureUrl;
    let profilePicReq = new Request(profilePictureUrl);
    let profilePic = await profilePicReq.loadImage();
    let photoStack = containerStack.addStack();
    photoStack.setPadding(10, 10, 10, 10);
    photoStack.addSpacer();
    let ProfilePhoto = photoStack.addImage(profilePic);
    ProfilePhoto.imageSize = new Size(90, 90);
    ProfilePhoto.cornerRadius = 90 / 2;
    ProfilePhoto.applyFillingContentMode();
    photoStack.addSpacer();
    let statRowStackTop = containerStack.addStack();
    statRowStackTop.setPadding(20, 10, 20, 10);
    statRowStackTop.centerAlignContent();
    let statRowStackBottom = containerStack.addStack();
    statRowStackBottom.centerAlignContent();
    statRowStackBottom.addSpacer();
    profileData.profileStats.map((stat, index) => {
        if (index <= 3) {
            createLargeStat(stat, statRowStackTop);
        }
        else {
            createLargeStat(stat, statRowStackBottom);
        }
    });
    statRowStackBottom.addSpacer();
    widget.presentLarge();
  };
  const createWidget = async (lensHandle) => {
    if (lensHandle == null || lensHandle == "lensprotocol") {
        lensHandle = "lensprotocol";
    }
    else {
        lensHandle += ".lens";
    }
    let widget = new ListWidget();
    let profileData = await getProfileStats(lensHandle);
    if (profileData == null) {
        createErrorText(widget, lensHandle);
        return widget;
    }
    let widgetSize = config.widgetFamily || "large";
    switch (widgetSize) {
        case "small":
            createSmallWidget(widget, profileData, lensHandle);
            break;
        case 'medium':
            createMediumWidget(widget, profileData, lensHandle);
            break;
        case 'large':
            await createLargeWidget(widget, profileData, lensHandle);
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