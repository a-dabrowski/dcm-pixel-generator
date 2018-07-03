const gapi = window.gapi;
const profileId = process.env.REACT_APP_PROFILE;
const apiKey = process.env.REACT_APP_API_KEY;
const clientId = process.env.REACT_APP_CLIENT_ID;
const placementTags = ["PLACEMENT_TAG_IFRAME_JAVASCRIPT",
    "PLACEMENT_TAG_TRACKING_JAVASCRIPT",
    "PLACEMENT_TAG_STANDARD",
    "PLACEMENT_TAG_JAVASCRIPT",
    "PLACEMENT_TAG_CLICK_COMMANDS",
    "PLACEMENT_TAG_TRACKING_IFRAME",
    "PLACEMENT_TAG_TRACKING",
    "PLACEMENT_TAG_INTERNAL_REDIRECT"
];
const scopes = "https://www.googleapis.com/auth/dfareporting https://www.googleapis.com/auth/dfatrafficking";
export function initClient() {
    console.log(this);
    gapi.client
        .init({
            apiKey: apiKey,
            clientId: clientId,
            scope: scopes
        })
        .then(() => {
            gapi.auth2
                .getAuthInstance()
                .isSignedIn.listen(this.updateSigninStatus); //TODO: Create function updateSigninStatus or maybe  AUTHINSTANCE reutrns null
            this.setState({
                logged: this.gapi.auth2.getAuthInstance().isSignedIn.get()
            });
            //TODO: listeners for authorize and signout click
        })
        .then(() => {
            getAdvertisers.call(this);
        });
};

export function getAdvertisers() {
    gapi.client
        .request({
            path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          profileId
        }/advertisers?key=${apiKey}`
        })
        .then(
            res => {
                const sorted = res.result.advertisers.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    } else {
                        return 1;
                    }
                })
                const advertisers = sorted.map(el => ({
                    name: el.name,
                    id: el.id,
                }));
                this.setState({
                    loaded: true,
                    advertisers: advertisers
                });
            },
            function (reason) {
                console.log(reason);
            }
        );
}
export function getSites() {
    gapi.client
        .request({
            path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          profileId
        }/sites?key=${apiKey}`
        })
        .then(
            res => {
                const sorted = res.result.sites.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    } else {
                        return 1;
                    }
                })
                const sites = sorted.map(el => ({
                    name: el.name,
                    id: el.id
                }));
                this.setState({
                    sites: sites
                });
            },
            function (reason) {
                console.log(reason);
            }
        );
}

export function getCampaigns(advertiserId) {
    gapi.client
        .request({
            path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          profileId
        }/campaigns?advertiserIds=${advertiserId}&key=${apiKey}`
        })
        .then(res => {
            const sorted = res.result.campaigns.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }
            })
            this.setState({
                campaigns: sorted.map(el => ({
                    name: el.name,
                    id: el.id,
                    start: el.startDate,
                    end: el.endDate
                }))
            })
        })
}

export function getAds(advertiserId, campaignId) {
    gapi.client
        .request({
            path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          profileId
        }/ads?advertiserIds=${advertiserId}&campaignIds=${campaignId}&key=${
          apiKey
        }`
        })
        .then(res => {

            const sorted = res.result.ads.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }

            });
            console.log(sorted[1].placementAssigments);
            this.setState({
                ads: sorted.map(el => ({
                    name: el.name,
                    id: el.id,
                    placements: el.placementAssigments[0].placementId, //potential list of plural placements, for now focus on single placement
                    creatives: el.creativeRotation.creativeAssignments[0].creativeId, //same as above
                }))
            });
        });
}

export function getPlacements(advertiserId, campaignId, siteId) {
    //siteId is optional
    gapi.client.request({
        path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${profileId}/placements?advertiserIds=${advertiserId}&campaignIds=${campaignId}${siteId ? '&siteIds=' + siteId : ""}&key=${apiKey}`
    }).then(res => {
        console.log(res);
        this.setState({
            placements: res.result.placements.map(el => ({
                name: el.name,
                id: el.id,
                siteId: el.siteId,
                keyName: el.keyName
            }))
        });
    });
}

export function getCreatives(advertiserId, campaignId, siteId) {
    //siteId is optional
    gapi.client.request({
      path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${profileId}/creatives?advertiserIds=${advertiserId}&campaignIds=${campaignId}${siteId ? '&siteIds=' + siteId : ""}&key=${apiKey}`
    }).then(res => {
        console.log(res);
        this.setState({
            creatives: res.result.creatives.map(el => ({
                name: el.name,
                id: el.id,
                advertiserId: el.advertiserId,
                width: el.size.width,
                height: el.size.height
            }))
        });
    });
}

export function createPlacement(name, advertiserId, siteId, campaignId, height, width, startDate, endDate) {
    const dimensions = 'dynamic';
    const ht = `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${this.profieId}/placements?key=${this.apiKey}`;
    const reqBody = {
        advertiserId: advertiserId,
        siteId: siteId,
        campaignId: campaignId,
        pricingSchedule: {
            startDate: startDate,
            endDate: endDate,
            pricingType: "PRICING_TYPE_CPM"
        },
        paymentSource: "PLACEMENT_AGENCY_PAID",
        tagFormats: [
            "PLACEMENT_TAG_IFRAME_JAVASCRIPT",
            "PLACEMENT_TAG_STANDARD",
            "PLACEMENT_TAG_JAVASCRIPT",
            "PLACEMENT_TAG_CLICK_COMMANDS",
            "PLACEMENT_TAG_TRACKING_IFRAME",
            "PLACEMENT_TAG_TRACKING"
        ],
        name: name,
        compatibility: "DISPLAY",
        size: {
            height: height,
            width: width
        }
    };
}