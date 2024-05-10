const menuItemReviewFixtures = {
    oneReview:{
        "itemId": 1,
        "reviewerEmail": "reviewer1@gmail.com", 
        "star": 3,
        "dateReviewed": "2022-01-02T12:00:00",
        "comments": "Meh"
    },
    threeReviews: [
        {
            "itemId": 1,
            "reviewerEmail": "reviewer1@gmail.com", 
            "star": 3,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "Meh"
        },

        {
            "itemId": 1,
            "reviewerEmail": "reviewer2@gmail.com", 
            "star":5,
            "dateReviewed": "2022-04-03T12:00:00",
            "comments": "Wonderful!"
        },
        
        {
            "itemId": 1,
            "reviewerEmail": "reviewer3@gmail.com", 
            "star": 1,
            "dateReviewed": "2022-07-04T12:00:00",
            "comments": "Disgusting"
        },
    ]
};

export { menuItemReviewFixtures };