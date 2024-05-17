import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function UCSBOrganizationEditPage({storybook=false}) {
  let { orgCode } = useParams();

  const { data: ucsbOrganization, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsborganization?orgCode=${orgCode}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsborganization`,
        params: {
          orgCode
        }
      }
    );


  const objectToAxiosPutParams = (ucsbOrganization) => ({
    url: "/api/ucsborganization",
    method: "PUT",
    params: {
      orgCode: ucsbOrganization.orgCode,
    },
    data: {
      orgCode: ucsbOrganization.orgCode,
      orgTranslationShort: ucsbOrganization.orgTranslationShort,
      orgTranslation: ucsbOrganization.orgTranslation,
      inactive: ucsbOrganization.inactive
    }
  });

  const onSuccess = (ucsbOrganization) => {
    toast(`UCSBOrganization Updated - orgCode: ${ucsbOrganization.orgCode} orgTranslationShort: ${ucsbOrganization.orgTranslationShort}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/UCSBOrganization?orgCode=${orgCode}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />
  }

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit page not yet implemented</h1>
      </div>
    </BasicLayout>
  )
}
