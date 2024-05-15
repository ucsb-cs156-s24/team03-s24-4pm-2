const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "easakawa@ucsb.edu",
        "teamId": "s24-4pm-2",
        "tableOrBreakoutRoom": "7",
        "requestTime": "2022-01-02T12:00:00",
        "explanation": "Lost my computer",
        "solved": false
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requesterEmail": "easakawa@ucsb.edu",
            "teamId": "s24-4pm-2",
            "tableOrBreakoutRoom": "7",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "Lost my computer",
            "solved": false
        },
        {
            "id": 2,
            "requesterEmail": "evan@ucsb.edu",
            "teamId": "s24-4pm-22",
            "tableOrBreakoutRoom": "table 76",
            "requestTime": "2023-15-02T12:00:00",
            "explanation": "Team is too awesome",
            "solved": true
        },
        {
            "id": 3,
            "requesterEmail": "a@ucsb.edu",
            "teamId": "s25-4pm-5",
            "tableOrBreakoutRoom": "breakout 5",
            "requestTime": "2022-01-02T12:00:44",
            "explanation": "tripp3d and fell and it rly hurts owieeeeee",
            "solved": false
        }
    ]
};


export { helpRequestFixtures };