const recommendationRequestFixtures = {
    oneDate: {
        "id": 1,
        "requesterEmail": "kaimaeda@ucsb.edu",
        "professorEmail": "phtcon@ucsb.edu	",
        "explanation": "BS/MS program",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2022-01-02T12:00:00",
        "done": "false"
    },
    threeDates: [
        {
            "id": 1,
            "requesterEmail": "kaimaeda@ucsb.edu",
            "professorEmail": "phtcon@ucsb.edu	",
            "explanation": "BS/MS program",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-01-02T12:00:00",
            "done": "false"
        },
        {
            "id": 2,
            "requesterEmail": "ldelplaya@ucsb.edu",
            "professorEmail": "phtcon@ucsb.edu",
            "explanation": "PhD CS Stanford",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-01-02T12:00:00",
            "done": "true"
        },
        {
            "id": 2,
            "requesterEmail": "ldelplaya@ucsb.edu",
            "professorEmail": "richert@ucsb.edu",
            "explanation": "PhD CS Stanford",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-01-02T12:00:00",
            "done": "true"
        }
    ]
};


export { recommendationRequestFixtures };