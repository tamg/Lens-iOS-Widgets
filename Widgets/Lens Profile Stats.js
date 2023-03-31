
let SETTINGS = {
  SMALL: {
    PADDING: 2,
    TITLE_FONT_SIZE: 14,
    PHOTO_SIZE: 60,
    STAT_FONT_SIZE: 12,
    NAME_FONT_SIZE: 10,
    HANDLE_FONT_SIZE: 11,
  },
  MEDIUM: {
    PADDING: 8,
    TITLE_FONT_SIZE: 16,
    PHOTO_SIZE: 60,
    STAT_FONT_SIZE: 16,
    NAME_FONT_SIZE: 10,
    HANDLE_FONT_SIZE: 12,
  },
  LARGE: {
    PADDING: 8,
    TITLE_FONT_SIZE: 16,
    PHOTO_SIZE: 60,
    STAT_FONT_SIZE: 15,
    NAME_FONT_SIZE: 10,
    HANDLE_FONT_SIZE: 12,
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
};
const createSmallStat = (stat, row) => {
  let { STAT_FONT_SIZE, NAME_FONT_SIZE } = SETTINGS.SMALL;
  let { title, data } = stat;
  row.setPadding(5, 12, 5, 3);
  let statStack = row.addStack();
  statStack.layoutHorizontally();
  statStack.url = '';
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
  statStack.url = '';
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
  statStack.url = '';
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
        followNftAddress
        metadata
        isDefault
        picture {
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
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
  req.headers = { "Content-Type": "application/json" };
  req.body = JSON.stringify({ query: profile_query });
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
      profile: res.data.profile
    };
    return profileData;
  }
  else {
    return null;
  }
};
const createSmallWidget = async (widget, profileData, lensHandle) => {
  console.log(profileData);
  let { PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.SMALL;
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
  let { PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.MEDIUM;
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
  let { PADDING, TITLE_FONT_SIZE, HANDLE_FONT_SIZE } = SETTINGS.LARGE;
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
  let profilePictureUrl = '';
  try {
    profilePictureUrl = profileData.profile.picture.original.url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  catch (error) {
    console.error(error);
    profilePictureUrl = `https://ui-avatars.com/api/?name=${profileData.profile.name.substring(0, 3)}&length=1`;
  }
  let profilePicReq = new Request(profilePictureUrl);
  let profilePic = await profilePicReq.loadImage();
  console.log(profilePictureUrl);
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
  let widgetSize = config.widgetFamily || "small";
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
