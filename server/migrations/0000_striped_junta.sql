CREATE TABLE `provider` (
	`key_id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`data` text NOT NULL,
	`update_at` integer NOT NULL,
	FOREIGN KEY (`key_id`) REFERENCES `user_key`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `song` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`url` text NOT NULL,
	`nominated_by_user_id` text,
	FOREIGN KEY (`nominated_by_user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `song_category` (
	`song_id` integer NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`name`, `song_id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatar` text NOT NULL,
	`role` text,
	`disabled` integer,
	`vote_slots` integer
);
--> statement-breakpoint
CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` blob NOT NULL,
	`idle_expires` blob NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vote` (
	`user_id` text NOT NULL,
	`song_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`song_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`song_id`) REFERENCES `song`(`id`) ON UPDATE cascade ON DELETE cascade
);
