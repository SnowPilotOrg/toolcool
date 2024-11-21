import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Snippet } from "@nextui-org/react";

export const Banner = () => {
	return (
		<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-4">
				<h1 className="font-bold text-4xl">Toolcool</h1>
				<h2 className="font-light text-lg">Tool calling for every API</h2>
			</div>
			<div className="flex flex-col items-start gap-4 sm:items-end">
				{/* TODO: Add link to the package */}
				<Snippet>npm install @snowpilot/tool-cool</Snippet>
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
