import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    const testIdPrefix = "MenuItemReviewForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="itemId">Item Id</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-itemId"}
                    id="itemId"
                    type="number"
                    isInvalid={Boolean(errors.itemId)}
                    {...register("itemId", {
                        required: "itemId is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.itemId?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="comments">Comment</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-comments"}
                    id="comments"
                    type="text"
                    isInvalid={Boolean(errors.comments)}
                    {...register("comments", {
                        required: "Comment is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.comments?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="reviewerEmail">Email</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-reviewerEmail"}
                    id="reviewerEmail"
                    type="text"
                    isInvalid={Boolean(errors.reviewerEmail)}
                    {...register("reviewerEmail", {
                        required: "reviewerEmail is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.reviewerEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="star">Stars</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-star"}
                    id="star"
                    type="number"
                    min="1"
                    max="5"
                    isInvalid={Boolean(errors.star)}
                    {...register("star", {
                        required: "Stars is required.",
                        validate: value => ((parseInt(value) >= 1) && (parseInt(value) <= 5)) || ("Must be a number 1-5.")
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.star?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">Date Reviewed</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-dateReviewed"}
                            id="dateReviewed"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateReviewed)}
                            {...register("dateReviewed", { required: true, pattern: { value: isodate_regex, message: 'Invalid date format.' } })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed && 'dateReviewed is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default MenuItemReviewForm;