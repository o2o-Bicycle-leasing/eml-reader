<script lang="ts">
import { readEml } from 'eml-parse-js'

import type { Locales } from '~/i18n/type.d.ts'
import { i18nFactory } from '~/i18n'
import openedAttachmentIndex from '~/stores/openedAttachmentIndex'
import emlData from '~/stores/emlData'

// Props
let userClass: string | undefined = undefined
let style: string | undefined = undefined
let locale: Locales | undefined = undefined
export {
	userClass as class,
	style,
	locale,
}

const _ = i18nFactory(locale)

let emlError: any = null

async function onChange(event: Event)
{
	const target = event.target as HTMLInputElement
	const file = target.files?.[0]
	if (!file)
	{
		return
	}

	const reader = new FileReader()
	reader.onload = async () =>
	{
		const content = reader.result as string

		readEml(
			content,
			(error, data) =>
			{
				target.value = ''

				if (error)
				{
					emlError = error
					openedAttachmentIndex.set(null)
					emlData.set(null)
					return
				}

				if (
					Object.keys(data.headers).length <= 0 ||
					(
						!data.headers.hasOwnProperty('Content-Type') &&
						data.headers.hasOwnProperty('')
					)
				)
				{
					emlError = 'Invalid EML file'
					openedAttachmentIndex.set(null)
					emlData.set(null)
					return
				}

				emlError = null
				openedAttachmentIndex.set(null)
				emlData.set(data)
				console.log(error, data)
			}
		)
	}
	reader.readAsText(file)
}
</script>

<div
	class={Array.from(new Set([
		...(userClass ? userClass.split(' ') : []),
		'flex flex-col space-y-4',
	])).join(' ')}
	style={style}
>

	<!-- Two columns for input & output -->
	<div class="grid grid-cols-2 gap-4">
		<!-- Input type -->
		<div class="space-y-4 col-span-2 sm:col-auto">
			<div class="block space-y-2">
				<span class="text-gray-700">
					{_({
						'en': 'File',
						'fr': 'Fichier',
					})}
				</span>
				<input
					type="file"
					class="form-input"
					accept="message/rfc822"
					on:change={onChange}
				/>
			</div>
		</div>
	</div>

	{#if emlError}
		<hr />

		<div>
			<b>
				{_({
					en: 'Error:',
					fr: 'Erreur :',
				})}
			</b>
			{emlError}
		</div>
	{/if}
</div>

<style lang="scss">
@reference "tailwindcss/theme";

/* Make the native file input read as a real button, on-theme with the
   retro skin (Flemish-Lion gold, ink border, letterpress offset). */
input[type="file"] {
	color: var(--color-o2o-text, #201E26);
}

input[type="file"]::file-selector-button {
	margin-right: 0.85rem;
	border: 1px solid var(--rvv-ink, #1C1813);
	border-radius: 2px;
	background-color: var(--rvv-gold, #D3A029);
	color: var(--rvv-ink, #1C1813);
	padding: 0.5rem 1rem;
	font-family: var(--font-heading, sans-serif);
	font-weight: 700;
	font-size: 0.8rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	cursor: pointer;
	box-shadow: 2px 2px 0 rgba(28, 24, 19, 0.2);
	transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

input[type="file"]::file-selector-button:hover {
	background-color: var(--rvv-gold-deep, #9C7317);
	color: #F3EEE0;
}

input[type="file"]::file-selector-button:active {
	box-shadow: 1px 1px 0 rgba(28, 24, 19, 0.2);
	transform: translate(1px, 1px);
}

.btn {
	@apply
		bg-gray-400
		enabled:hover:bg-gray-500
		disabled:bg-gray-300
		px-4
		py-2
		text-white
		font-semibold
		rounded-md
		disabled:cursor-not-allowed
		;

	&.btn-primary {
		@apply
			bg-blue-500
			enabled:hover:bg-blue-600
			disabled:bg-blue-300
			;
	}
}

textarea {
	@apply
		border
		border-gray-300
		;

	&.default {
		@apply text-gray-600
	}

	&.error {
		@apply border-red-600 text-red-600;
	}
}

</style>
