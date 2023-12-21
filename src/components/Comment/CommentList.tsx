import CommentItem from "./CommentItem";
import { CommentType } from "../../types/types";
import React from "react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

type CommentListProps = {
    comments: CommentType[];
};

const CommentList = (props: CommentListProps) => {
    return (
        <Box style={{ width: "70%", margin: "auto", marginTop: "3rem" }}>
            {props.comments.length > 0 && (
                <Typography variant="h5">{`${props.comments.length} Comment${
                    props.comments.length > 1 ? "s" : ""
                }`}</Typography>
            )}
            <ul style={{ padding: 0 }}>
                {props.comments.map((comment, index) => (
                    <Box key={index}>
                        <CommentItem comment={comment} />
                    </Box>
                ))}
            </ul>
        </Box>
    );
};

export default CommentList;
