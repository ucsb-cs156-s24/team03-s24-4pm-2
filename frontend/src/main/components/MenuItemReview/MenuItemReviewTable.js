import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/MenuItemReviewUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MenuItemReviewTable({
    menuItemReviews,
    currentUser,
    testIdPrefix = "MenuItemReviewTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/menuitemreview/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/menuitemreview/all"]
    );
    // Stryker restore all

    // Stryker disable next-line all
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id',
        },

        {
            Header: 'Item Id',
            accessor: 'itemId',
        },

        {
            Header: 'Comment',
            accessor: 'comments',
        },

        {
            Header: 'Email',
            accessor: 'reviewerEmail',
        },

        {
            Header: 'Stars',
            accessor: 'star',
        },

        {
            Header: 'Date Reviewed',
            accessor: 'dateReviewed',
        }
        
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    }

    return <OurTable
        data={menuItemReviews}
        columns={columns}
        testid={testIdPrefix}
    />;
}