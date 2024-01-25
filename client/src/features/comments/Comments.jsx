import { useState } from "react";
import { commentsSortValues, commentsSortTexts } from '../../data/constants';
import SelectInput from "../../ui/SelectInput";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import './comments.scss';

export default function Comments({ comments }) {
    const [sortOption, setSortOption] = useState('new');

    const handleSortOptionChange = function(e) {
        setSortOption(e.target.value);
    };

    return (
        <section className='comments'>
            <CommentForm />
            <div className='comments__sort'>
                <SelectInput
                    width={'14rem'}
                    currentValue={sortOption}
                    valuesList={commentsSortValues}
                    textsList={commentsSortTexts}
                    onHandleSortOptionChange={handleSortOptionChange}
                />
            </div>
            <CommentsList comments={comments} />
        </section>
    )
}