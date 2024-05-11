import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({storybook=false}) {

  const objectToAxiosParams = (diningcommonsmenuitem) => ({
    url: "/api/diningcommonsmenuitem/post",
    method: "POST",
    params: {
     id:diningcommonsmenuitem.id,
     diningCommonsCode: diningcommonsmenuitem.diningCommonsCode,
     name: diningcommonsmenuitem.name,
     station: diningcommonsmenuitem.station
    }
  });

  const onSuccess = (diningcommonsmenuitem) => {
    toast(`New diningcommonsmenuitem Created - id: ${diningcommonsmenuitem.id} name: ${diningcommonsmenuitem.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsbdiningcommonsmenuitem/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsbdiningcommonsmenuitem" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Dining Commons Menu Item</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
