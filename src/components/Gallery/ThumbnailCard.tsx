import React, { useRef, useState } from "react";

interface ThumbnailCardProps {
	image: {
		variants: {
			"320": {
				filename: string;
			};
		};
		comment: string;
	};
	isSelected: boolean;
	onClick: () => void;
	toggleMarkForDeletion: () => void;
	isMarkedForDeletion: boolean;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({
	image,
	isSelected,
	onClick,
	toggleMarkForDeletion,
	isMarkedForDeletion,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
	const isHoldActionCompleted = useRef(false);

	const handlePressStart = () => {
		isHoldActionCompleted.current = false;
		holdTimerRef.current = setTimeout(() => {
			toggleMarkForDeletion();
			isHoldActionCompleted.current = true;
		}, 500); // 500ms threshold for "press and hold"
	};

	const handlePressEnd = () => {
		if (holdTimerRef.current) {
			clearTimeout(holdTimerRef.current);
			holdTimerRef.current = null;
		}
	};

	const handleClick = (e: React.MouseEvent) => {
		if (isHoldActionCompleted.current) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		onClick();
	};

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
	};

	return (
		<div
			className={`rounded-lg relative cursor-pointer transition-transform duration-200 ${
				isSelected ? "ring-4 ring-lime-500" : ""
			} ${isMarkedForDeletion ? "opacity-50" : ""}`}
			onMouseDown={handlePressStart}
			onMouseUp={handlePressEnd}
			onMouseLeave={handlePressEnd}
			onTouchStart={handlePressStart}
			onTouchEnd={handlePressEnd}
			onClick={handleClick}
			onContextMenu={handleContextMenu}
		>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-8 h-8 border-4 border-white-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
			<img
				src={`https://i.awake-careful-ant.com/optimized/320/${image.variants["320"].filename}`}
				alt={image.comment}
				style={{ objectFit: "cover", width: "100%", minHeight: "100px" }}
				className="rounded-lg"
				onLoad={() => setIsLoading(false)}
			/>
			{isMarkedForDeletion && (
				<div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
					<span className="text-white text-6xl font-bold">=X=</span>
				</div>
			)}
			<div
				className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-200"
				onClick={e => {
					e.stopPropagation(); // Prevent triggering the onClick event of the card
					toggleMarkForDeletion();
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
					/>
				</svg>
			</div>
		</div>
	);
};

export default ThumbnailCard;
