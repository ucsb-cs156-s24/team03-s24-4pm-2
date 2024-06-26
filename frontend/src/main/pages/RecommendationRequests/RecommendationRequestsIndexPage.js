import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from 'main/components/RecommendationRequests/RecommendationRequestTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function RecommendationRequestsIndexPage() {

  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/recommendationrequest/create"
                style={{ float: "right" }}
            >
                Create Recommendation Request 
            </Button>
        )
    } 
  }
  
  const { data: recommendationrequests, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/recommendationrequest/all"],
      { method: "GET", url: "/api/recommendationrequest/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Recommendation Requests</h1>
        <RecommendationRequestTable recommendationrequests={recommendationrequests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}