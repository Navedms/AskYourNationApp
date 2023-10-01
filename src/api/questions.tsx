import { Nation } from './auth';
import client from './client';

const endpoint = '/questions';

export interface Answers {
	options: string[];
	correctIndex?: 0 | 1 | 2 | 3;
}

interface CreatedBy {
	id: string;
	firstName: string;
	lastName: string;
}

export interface AmountOfanswers {
	all: number;
	correct: number;
}
export interface Rating {
	value: number;
	numberOfRatings: number;
	rank: number;
}

export interface Question {
	_id?: string;
	nation?: Nation;
	question: string;
	answers: Answers;
	rating?: Rating;
	amountOfanswers?: AmountOfanswers;
	createdBy?: CreatedBy;
}

interface Answer {
	id: string;
	answerIndex: number;
}

interface RatingProps {
	id: string;
	rating: number;
}

interface ReportProps {
	id: string;
	reason: string;
	text: string;
}

export interface ShowAnswers {
	correctIndex: number;
	userAnsweredCorrect: boolean;
	userIndex: number;
}

const get = () => client.get(endpoint);

const getMyQuestions = () => client.get(`${endpoint}/my-questions`);

const post = (data: Question) => client.post(`${endpoint}`, data);

const update = (data: Question) => client.patch(`${endpoint}/update`, data);

const answer = ({ id, answerIndex }: Answer) =>
	client.patch(`${endpoint}/answer`, {
		id,
		answerIndex,
	});

const rating = ({ id, rating }: RatingProps) =>
	client.patch(`${endpoint}/rating`, {
		id,
		rating,
	});

const report = ({ id, reason, text }: ReportProps) =>
	client.patch(`${endpoint}/report`, {
		id,
		reason,
		text,
	});

const remove = (id: string) => client.delete(`${endpoint}?id=${id}`);

export default {
	get,
	getMyQuestions,
	post,
	update,
	answer,
	rating,
	report,
	remove,
};
