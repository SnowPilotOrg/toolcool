import { Snippet } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Banner = () => {
	return (
		<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
			<div className="flex flex-col gap-4">
				<h1 className="text-4xl font-bold">Toolcool</h1>
				<h2 className="text-lg font-light">Tool calling for every SaSS app</h2>
			</div>
			<div className="flex flex-col gap-4 sm:items-end items-start">
				{/* TODO: Add link to the package */}
				<Snippet>npm install toolcool</Snippet>
				<Button
					startContent={<FontAwesomeIcon icon={faGithub} />}
					variant="light"
					//TODO: Add link to the repo
					href="https://github.com/SnowPilotOrg/tool-cool"
				>
					SnowPilotOrg/tool-cool
				</Button>
			</div>
		</div>
	);
};
